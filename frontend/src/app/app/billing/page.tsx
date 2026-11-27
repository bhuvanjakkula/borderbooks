"use client";
import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { asError } from "@/lib/errors";

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    price: "$49",
    cadence: "/ month",
    description: "For solo operators and finance teams automating core invoice-to-bank matching.",
    featured: false,
    cta: "Choose Starter",
    features: [
      "1 workspace included",
      "Up to 2,000 rows per reconciliation run",
      "Deterministic invoice & bank CSV matching",
      "Bank & generic statement parsers",
      "Explainable audit trail & XLSX / CSV journal exports",
      "30-day automatic upload deletion & zero bank scraping",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: "$149",
    cadence: "/ month",
    description: "For growing multi-currency businesses reconciling Stripe, Wise, Payoneer & bank payouts.",
    featured: true,
    cta: "Choose Professional",
    features: [
      "Up to 5 workspaces",
      "Up to 10,000 rows per reconciliation run",
      "Multi-source parsers (Bank, Stripe, Wise, Payoneer)",
      "Live & historical multi-currency FX rates",
      "Stripe Payout FX Split analyzer (fees & FX gain/loss)",
      "Custom account labels, match-window replay & PDF reports",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "$499",
    cadence: "/ month",
    description: "For high-volume finance operations requiring unlimited scale and compliance governance.",
    featured: false,
    cta: "Choose Enterprise",
    features: [
      "Unlimited workspaces & team members",
      "Unlimited rows per high-volume batch run",
      "All Professional reconciliation, FX & Stripe Split tools",
      "Audit-ready compliance workpapers & custom exports",
      "Dedicated onboarding & priority technical support",
      "Custom SLA & enterprise security review",
    ],
  },
] as const;

export default function BillingPage() {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function open(path: string, body: unknown, key: string) {
    setBusy(key);
    setError("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not open billing");
      window.location.assign(data.url);
    } catch (value) {
      setError(asError(value, "Could not open billing").message);
      setBusy("");
    }
  }

  return (
    <main className="page narrow">
      <div className="page-head">
        <div>
          <p className="eyebrow">Billing · USD / Month</p>
          <h1>Plans sized to your reconciliation volume</h1>
          <p className="subtle">
            Every tier runs on BorderBooks&apos; deterministic reconciliation engine with an immutable, explainable audit trail. All prices in US Dollars (USD) per month.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => open("/api/billing/portal", {}, "portal")}
          disabled={Boolean(busy)}
        >
          Manage billing <ExternalLink size={15} />
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <section
            key={plan.id}
            className={`price-card card${plan.featured ? " featured" : ""}`}
          >
            <p className="eyebrow">
              {plan.name}
              {plan.featured ? " · Most Popular" : ""}
            </p>
            <h2>
              {plan.price} <small>USD {plan.cadence}</small>
            </h2>
            <p className="subtle" style={{ fontSize: 13, marginBottom: 0 }}>
              {plan.description}
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} style={{ flexShrink: 0, color: "var(--green)" }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={plan.featured ? "button" : "button secondary"}
              style={{ width: "100%" }}
              disabled={Boolean(busy)}
              onClick={() => open("/api/billing/checkout", { plan: plan.id }, plan.id)}
            >
              {busy === plan.id ? "Opening checkout…" : plan.cta}
            </button>
          </section>
        ))}
      </div>

      <p className="privacy-line">
        Statement data is never used for training. BorderBooks sends only workspace and plan identifiers to Stripe.
      </p>
    </main>
  );
}
