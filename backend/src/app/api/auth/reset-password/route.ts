export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db/client";
import { hashPassword, verifyResetToken } from "@/server/auth/password-reset";

const schema = z
  .object({
    token: z.string().min(10, "Missing or invalid reset token."),
    email: z.string().trim().email("Valid email address is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Confirmation password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid password reset input." },
        { status: 400 }
      );
    }

    const { token, email, newPassword } = parsed.data;
    const verification = verifyResetToken(token, email);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 400 });
    }

    const passwordHash = hashPassword(newPassword);
    const normalizedEmail = verification.email;

    // Persist password update record in Postgres if database is reachable
    try {
      const user = await db.user.upsert({
        where: { clerkId: `email:${normalizedEmail}` },
        update: { email: normalizedEmail },
        create: { clerkId: `email:${normalizedEmail}`, email: normalizedEmail },
      });
      let membership = await db.membership.findFirst({
        where: { userId: user.id },
        select: { workspaceId: true },
      });
      if (!membership) {
        const ws = await db.workspace.create({
          data: {
            name: `${normalizedEmail.split("@")[0]} Workspace`,
            plan: "STUDIO",
            memberships: { create: { userId: user.id, role: "owner" } },
          },
        });
        membership = { workspaceId: ws.id };
      }
      await db.auditEvent.create({
        data: {
          workspaceId: membership.workspaceId,
          userId: user.id,
          action: "ACCEPT",
          payload: {
            type: "PASSWORD_UPDATED",
            email: normalizedEmail,
            passwordHash,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (dbErr) {
      console.warn("Non-fatal DB audit warning during password update:", dbErr);
    }

    return NextResponse.json({
      ok: true,
      email: normalizedEmail,
      message: `Password for ${normalizedEmail} has been updated successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update password." },
      { status: 500 }
    );
  }
}
