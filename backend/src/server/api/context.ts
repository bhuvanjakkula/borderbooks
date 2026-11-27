import { db } from "../db/client";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const DEFAULT_USER_KEY = "borderbooks-direct-user";
const DEFAULT_USER_EMAIL = "workspace@borderbooks.app";

export async function requireApiContext(request: Request) {
  const user = await db.user.upsert({
    where: { clerkId: DEFAULT_USER_KEY },
    update: {},
    create: { clerkId: DEFAULT_USER_KEY, email: DEFAULT_USER_EMAIL },
  });

  const requested = request.headers.get("x-workspace-id");
  let membership = await db.membership.findFirst({
    where: { userId: user.id, ...(requested ? { workspaceId: requested } : {}) },
    include: { workspace: true },
    orderBy: { id: "asc" },
  });

  if (!membership && !requested) {
    const workspace = await db.workspace.create({
      data: {
        name: "My BorderBooks Workspace",
        plan: "STUDIO",
        memberships: { create: { userId: user.id, role: "owner" } },
      },
    });
    membership = await db.membership.findFirst({
      where: { userId: user.id, workspaceId: workspace.id },
      include: { workspace: true },
    });
  }

  if (!membership) throw new ApiError(403, "WORKSPACE_FORBIDDEN", "Workspace membership required");
  return { db, user, workspace: membership.workspace, membership };
}

export type ApiContext = Awaited<ReturnType<typeof requireApiContext>>;
