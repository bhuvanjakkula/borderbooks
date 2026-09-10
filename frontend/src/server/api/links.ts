import type { LinkStatus } from "@prisma/client";
import { ApiError, type ApiContext } from "./context";

export async function setLinkStatus(context: ApiContext, runId: string, linkId: string, status: LinkStatus) {
  const link = await context.db.matchLink.findFirst({
    where: { id: linkId, runId, run: { workspaceId: context.workspace.id } },
  });
  if (!link) throw new ApiError(404, "MATCH_LINK_NOT_FOUND", "Match link not found");
  return context.db.$transaction(async (tx) => {
    const updated = await tx.matchLink.update({ where: { id: link.id }, data: { status } });
    await tx.auditEvent.create({
      data: {
        workspaceId: context.workspace.id,
        userId: context.user.id,
        action: status === "ACCEPTED" ? "ACCEPT" : "REJECT",
        payload: { runId, linkId },
      },
    });
    return updated;
  });
}
