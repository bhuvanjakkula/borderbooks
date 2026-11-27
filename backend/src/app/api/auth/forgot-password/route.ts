export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createResetToken } from "@/server/auth/password-reset";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid registered email address."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Valid email is required." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const token = createResetToken(email);
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://borderbooks.vercel.app");

    const resetUrl = `${origin.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(
      token
    )}&email=${encodeURIComponent(email)}`;

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "BorderBooks Support <contact@apolloaiglobalcompany.com>",
            to: [email],
            subject: "Reset your BorderBooks password",
            html: `<p>We received a request to update the password for <strong>${email}</strong>.</p><p><a href="${resetUrl}">Click here to update your password</a> (valid for 30 minutes).</p><p>Need help? Contact <a href="mailto:contact@apolloaiglobalcompany.com">contact@apolloaiglobalcompany.com</a>.</p>`,
          }),
        });
        emailSent = res.ok;
      } catch (err) {
        console.error("Resend email delivery failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      email,
      emailSent,
      resetUrl,
      expiresInMinutes: 30,
      message: emailSent
        ? `A password update link has been sent to ${email}.`
        : `Your secure password update link for ${email} is ready below (valid for 30 minutes).`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate password reset link." },
      { status: 500 }
    );
  }
}
