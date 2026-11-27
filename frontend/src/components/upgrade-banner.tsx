"use client";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const TIERS = [
  {
    id: "STARTER",
    name: "Starter",
    price: "$49 / mo USD",
    summary: "1 workspace · 2,000 rows/run · CSV & PDF OCR matching",
    stripeUrl: "https://buy.stripe.com/7sY28jeFUfWt9L9gQS2oE13",
    accent: "var(--green)",
    featured: false,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: "$199 / mo USD",
    summary: "5 workspaces · 10,000 rows/run · FX Rates, Stripe Split & RBAC",
    stripeUrl: "https://buy.stripe.com/bJefZ9fJYh0x9L9bwy2oE12",
    accent: "var(--amber)",
    featured: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "$499 / mo USD",
    summary: "Unlimited workspaces & rows · Compliance workpapers & custom SLA",
    stripeUrl: "https://buy.stripe.com/aFa3cngO24dL5uT0RU2oE11",
    accent: "var(--ink)",
    featured: false,
  },
] as const;

export function UpgradeBanner() {
  return (
    <aside
      className="upgrade-banner"
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "1.25rem",
        background: "var(--amber-soft)",
        border: "1px solid #fcd34d",
        color: "var(--ink)",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)",
      }}
    >
      <div>
        <strong
          style={{
            fontSize: "1.05rem",
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ShieldCheck size={18} style={{ color: "#b45309" }} />
          BorderBooks Monthly Plans (USD)
        </strong>
        <p style={{ color: "#b45309", fontSize: "0.88rem", marginTop: "0.4rem", marginBottom: 0 }}>
          Scale your reconciliation volume, multi-currency FX tools, OCR uploads, and team workspaces anytime.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            style={{
              background: "rgba(255,255,255,0.85)",
              padding: "1.25rem",
              borderRadius: "8px",
              border: tier.featured ? "1.5px solid var(--green)" : "1px solid rgba(255,255,255,0.95)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div>
              <h4
                style={{
                  margin: "0 0 0.25rem 0",
                  color: tier.accent,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                }}
              >
                {tier.name}
              </h4>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                {tier.price}
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                {tier.summary}
              </p>
            </div>
            <a
              href={tier.stripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={tier.featured ? "button" : "button secondary"}
              style={{ width: "100%", textDecoration: "none", textAlign: "center" }}
            >
              Choose {tier.name} <ArrowUpRight size={15} />
            </a>
          </div>
        ))}
      </div>
    </aside>
  );
}
