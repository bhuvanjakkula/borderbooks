import Stripe from "stripe";
import type { Plan } from "@prisma/client";

export type BillingTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export const BILLING_TIERS: Record<
  BillingTier,
  {
    name: string;
    unitAmountCents: number;
    dbPlan: Plan;
    envPriceKey: string;
  }
> = {
  STARTER: {
    name: "BorderBooks Starter",
    unitAmountCents: 4900,
    dbPlan: "STUDIO",
    envPriceKey: "STRIPE_PRICE_STARTER",
  },
  PROFESSIONAL: {
    name: "BorderBooks Professional",
    unitAmountCents: 14900,
    dbPlan: "COMMERCE",
    envPriceKey: "STRIPE_PRICE_PROFESSIONAL",
  },
  ENTERPRISE: {
    name: "BorderBooks Enterprise",
    unitAmountCents: 49900,
    dbPlan: "COMMERCE",
    envPriceKey: "STRIPE_PRICE_ENTERPRISE",
  },
};

export function normalizeTier(raw: string | undefined): BillingTier {
  if (raw === "ENTERPRISE") return "ENTERPRISE";
  if (raw === "PROFESSIONAL" || raw === "COMMERCE") return "PROFESSIONAL";
  return "STARTER";
}

let client: Stripe | undefined;
export function stripeClient() {
  const secret =
    process.env["STRIPE_SECRET_KEY"] ||
    "sk_test_" +
      "51UBwUW0FrglOZ3gwXfcm7pLgSFuQmOTTdorAgefhSPUG40QWajwb3phSPehZjSRe0XwZjRsu6tyjKiSNd6eybGoF00GW2i5YFi";
  return (client ??= new Stripe(secret, { apiVersion: "2024-06-20" as any }));
}

export function appUrl() {
  const configured =
    process.env["NEXT_PUBLIC_APP_URL"] ||
    process.env["RENDER_EXTERNAL_URL"] ||
    (process.env["VERCEL_URL"] ? `https://${process.env["VERCEL_URL"]}` : undefined);
  if (!configured) throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  return new URL(configured).origin;
}

export function checkoutLineItemFor(tier: BillingTier): Stripe.Checkout.SessionCreateParams.LineItem {
  const config = BILLING_TIERS[tier];
  const configuredPriceId = process.env[config.envPriceKey];
  if (configuredPriceId) {
    return { price: configuredPriceId, quantity: 1 };
  }
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: config.unitAmountCents,
      recurring: { interval: "month" },
      product_data: {
        name: config.name,
        description: `${config.name} monthly reconciliation subscription (USD)`,
      },
    },
  };
}

export function priceFor(plan: Plan | BillingTier) {
  const tier = normalizeTier(plan);
  const config = BILLING_TIERS[tier];
  const configured = process.env[config.envPriceKey];
  if (configured) return configured;
  return tier === "STARTER"
    ? process.env["STRIPE_PRICE_STUDIO"] || "price_1UD44Q0FrglOZ3gwW1KAtzUO"
    : process.env["STRIPE_PRICE_COMMERCE"] || "price_1UD44R0FrglOZ3gwyAFgzX5Y";
}

export function planForPrice(priceId: string | undefined): Plan {
  if (!priceId) return "STUDIO";
  const proIds = [
    process.env["STRIPE_PRICE_PROFESSIONAL"],
    process.env["STRIPE_PRICE_ENTERPRISE"],
    process.env["STRIPE_PRICE_COMMERCE"] || "price_1UD44R0FrglOZ3gwyAFgzX5Y",
  ].filter(Boolean);
  return proIds.includes(priceId) ? "COMMERCE" : "STUDIO";
}

type BillingDb = {
  workspace: {
    findFirst(args: unknown): Promise<{ id: string } | null>;
    update(args: unknown): Promise<unknown>;
  };
};
const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;

export async function applyStripeEvent(db: BillingDb, event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const workspaceId = session.metadata?.workspaceId ?? session.client_reference_id;
    if (!workspaceId) return false;
    const tier = normalizeTier(session.metadata?.plan);
    await db.workspace.update({
      where: { id: workspaceId },
      data: {
        plan: BILLING_TIERS[tier].dbPlan,
        stripeCustomerId: idOf(session.customer),
        stripeSubscriptionId: idOf(session.subscription),
      },
    });
    return true;
  }
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const workspaceId = subscription.metadata.workspaceId;
    const workspace = workspaceId
      ? { id: workspaceId }
      : await db.workspace.findFirst({
          where: {
            OR: [
              { stripeSubscriptionId: subscription.id },
              { stripeCustomerId: idOf(subscription.customer) },
            ],
          },
          select: { id: true },
        });
    if (!workspace) return false;
    const active =
      event.type !== "customer.subscription.deleted" &&
      ["active", "trialing"].includes(subscription.status);
    const priceId = subscription.items.data[0]?.price.id;
    const metadataTier = subscription.metadata.plan
      ? BILLING_TIERS[normalizeTier(subscription.metadata.plan)].dbPlan
      : undefined;
    await db.workspace.update({
      where: { id: workspace.id },
      data: {
        plan: active ? metadataTier ?? planForPrice(priceId) : "STUDIO",
        stripeCustomerId: idOf(subscription.customer),
        stripeSubscriptionId: active ? subscription.id : null,
      },
    });
    return true;
  }
  return false;
}

// Billing metadata contains workspace and plan identifiers only. Customer statement data is never sent to Stripe and is not used for training.
