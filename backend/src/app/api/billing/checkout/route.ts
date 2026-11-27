export const dynamic = "force-dynamic";
import { z } from "zod";
import { requireApiContext } from "@/server/api/context";
import { failure, json, optionalJson } from "@/server/api/http";
import {
  appUrl,
  checkoutLineItemFor,
  normalizeTier,
  stripeClient,
} from "@/server/billing/stripe";

const schema = z
  .object({
    plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE", "STUDIO", "COMMERCE"]),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const context = await requireApiContext(request);
    const { plan } = schema.parse(await optionalJson(request));
    const tier = normalizeTier(plan);
    const stripe = stripeClient();
    const origin = appUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [checkoutLineItemFor(tier)],
      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      success_url: `${origin}/api/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app/billing?billing=cancelled`,
      client_reference_id: context.workspace.id,
      metadata: { workspaceId: context.workspace.id, plan: tier },
      subscription_data: { metadata: { workspaceId: context.workspace.id, plan: tier } },
      ...(context.workspace.stripeCustomerId
        ? { customer: context.workspace.stripeCustomerId, customer_update: { address: "auto" } }
        : { customer_email: context.user.email }),
    });
    return json({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
