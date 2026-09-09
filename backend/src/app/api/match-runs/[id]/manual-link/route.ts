import { ApiError, requireApiContext } from "@/server/api/context";
import { failure, json, optionalJson } from "@/server/api/http";
import { manualLinkSchema } from "@/server/api/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireApiContext(request);
    const body = manualLinkSchema.parse(await optionalJson(request));
    const { id: runId } = await params;
    const [run, invoice, txn] = await Promise.all([
      context.db.matchRun.findFirst({ where: { id: runId, workspaceId: context.workspace.id } }),
      context.db.invoice.findFirst({ where: { id: body.invoiceId, workspaceId: context.workspace.id } }),
      context.db.bankTxn.findFirst({ where: { id: body.txnId, workspaceId: context.workspace.id } }),
    ]);
    if (!run || !invoice || !txn) throw new ApiError(404, "MANUAL_LINK_TARGET_NOT_FOUND", "Run, invoice, or transaction not found");
    const accepted = await context.db.matchLink.findFirst({ where: { runId, status: "ACCEPTED", OR: [{ invoiceId: invoice.id }, { txnId: txn.id }] } });
    if (accepted) throw new ApiError(409, "ALREADY_ACCEPTED", "Invoice or transaction is already accepted in this run");
    const link = await context.db.$transaction(async (tx) => {
      const created = await tx.matchLink.create({
        data: {
          runId,
          invoiceId: invoice.id,
          txnId: txn.id,
          confidence: 100,
          method: "MANUAL",
          flags: [],
          status: "ACCEPTED",
          expectedMinor: invoice.amountMinor,
          receivedMinor: txn.amountMinor,
          feeMinor: 0n,
          fxDiffMinor: 0n,
          explanation: "Manually linked by an authorized workspace user.",
        },
      });
      await tx.auditEvent.create({
        data: { workspaceId: context.workspace.id, userId: context.user.id, action: "MANUAL", payload: { runId, linkId: created.id, ...body } },
      });
      return created;
    });
    return json(link, 201);
  } catch (error) {
    return failure(error);
  }
}
