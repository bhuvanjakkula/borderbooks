"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sparkles,
  FilePlus2,
  BarChart3,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  History,
  ArrowRight,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Show unpaid invoices above $5,000 overdue by 30+ days",
  "Summarize duplicate invoice anomalies this month",
  "Show FX variance impact across USD/EUR settlements",
];

const APPLICATIONS = [
  {
    title: "Reconciliation Runs",
    desc: "Deterministic invoice-to-bank match runs & audit explanations",
    href: "/app",
    icon: History,
  },
  {
    title: "Import Hub & PDF OCR",
    desc: "Upload CSV statements or extract invoice fields via AI OCR",
    href: "/app/new",
    icon: FilePlus2,
  },
  {
    title: "Multi-Currency FX Rates",
    desc: "Live & historical mid-market rates with 30-day trend sparklines",
    href: "/app/fx-rates",
    icon: BarChart3,
  },
  {
    title: "Stripe Forensic FX Split",
    desc: "Decompose payouts into sales, refunds, fees & FX gain/loss",
    href: "/app/stripe-split",
    icon: TrendingUp,
  },
  {
    title: "Exceptions Queue",
    desc: "Review short-payments, duplicates & amount mismatches",
    href: "/app/exceptions",
    icon: AlertCircle,
  },
  {
    title: "Immutable Audit Ledger",
    desc: "Cryptographically tracked RBAC mutations & CSV audit exports",
    href: "/app/security",
    icon: ShieldCheck,
  },
] as const;

export default function CopilotDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<{ prompt: string; summary: string; actionHref: string; actionLabel: string } | null>(null);

  function runCopilot(customPrompt?: string) {
    const q = (customPrompt ?? query).trim();
    if (!q) return;
    if (customPrompt) setQuery(customPrompt);
    const lower = q.toLowerCase();

    if (lower.includes("fx") || lower.includes("currency") || lower.includes("eur") || lower.includes("usd")) {
      setAnswer({
        prompt: q,
        summary:
          "Multi-currency FX analysis: 4 cross-border settlement batches show a net realized FX variance of -$1,142.80 USD across EUR/USD and GBP/USD pairs. Open FX Rates or Stripe FX Split to inspect leg-level mid-market spreads.",
        actionHref: "/app/fx-rates",
        actionLabel: "Open FX Rates Engine",
      });
    } else if (lower.includes("duplicate") || lower.includes("anomal") || lower.includes("mismatch") || lower.includes("overdue") || lower.includes("unpaid")) {
      setAnswer({
        prompt: q,
        summary:
          "AP Copilot found 73 items needing review and 35 high-risk anomalies (21 suspected duplicates, 14 amount/tax mismatches). Top flagged item: Global Tech INV-8832 ($4,200, 82% confidence).",
        actionHref: "/app/exceptions",
        actionLabel: "Open Exceptions Queue",
      });
    } else if (lower.includes("audit") || lower.includes("security") || lower.includes("rbac")) {
      setAnswer({
        prompt: q,
        summary:
          "Zero-Trust Audit Ledger: All 3 recent privileged events are cryptographically logged (1 pending dual-approval bank change, 1 auto-match, 1 RBAC-blocked read-only attempt).",
        actionHref: "/app/security",
        actionLabel: "Open Audit Ledger",
      });
    } else {
      setAnswer({
        prompt: q,
        summary:
          "Reconciliation summary: 1,284 invoices processed with 91.5% straight-through processing (1,176 auto-matched, 99.2% OCR extraction accuracy). Start a new reconciliation run or review flagged exceptions.",
        actionHref: "/app/new",
        actionLabel: "Start New Run",
      });
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">COMMAND CENTER</p>
          <h1>BorderBooks AI Copilot</h1>
          <p className="subtle">
            Intelligent financial-control layer. Real-time invoice-to-PO matching, OCR extraction, FX attribution, and anomaly detection.
          </p>
        </div>
      </div>

      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          runCopilot();
        }}
        style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", marginBottom: "0.75rem" }}
      >
        <Search size={22} style={{ color: "#10b981", flexShrink: 0 }} />
        <input
          type="text"
          placeholder='Try asking: "Show unpaid invoices above $5,000 overdue by 30+ days"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, border: "none", background: "transparent", fontSize: "1rem", outline: "none" }}
        />
        <button type="submit" className="button" style={{ background: "#10b981", borderColor: "#10b981" }}>
          <Sparkles size={15} /> Ask AI
        </button>
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {QUICK_PROMPTS.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => runCopilot(sample)}
            className="button secondary small"
            style={{ fontWeight: 500, fontSize: "0.78rem" }}
          >
            {sample}
          </button>
        ))}
      </div>

      {answer && (
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            borderColor: "#10b981",
            background: "rgba(16, 185, 129, 0.06)",
          }}
        >
          <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>
            AI COPILOT RESPONSE · &ldquo;{answer.prompt}&rdquo;
          </p>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", lineHeight: 1.55 }}>{answer.summary}</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href={answer.actionHref} className="button small" style={{ background: "#10b981", borderColor: "#10b981" }}>
              {answer.actionLabel} <ArrowRight size={14} />
            </Link>
            <button type="button" className="button secondary small" onClick={() => setAnswer(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", marginTop: "1.5rem" }}>Core AP Operations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        <div className="card" style={{ padding: "1.25rem", borderColor: "#10b981", background: "rgba(16, 185, 129, 0.05)" }}>
          <p className="eyebrow">STRAIGHT-THROUGH PROCESSING (STP)</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>91.5%</h2>
          <span style={{ color: "#10b981", fontSize: "0.85rem" }}>Safely processed without manual intervention</span>
        </div>
        <div className="card" style={{ padding: "1.25rem", cursor: "pointer" }} onClick={() => router.push("/app")}>
          <p className="eyebrow">INVOICES PROCESSED</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>1,284</h2>
          <span style={{ color: "#10b981", fontSize: "0.85rem" }}>1,176 auto-matched · View Runs →</span>
        </div>
        <div className="card" style={{ padding: "1.25rem", cursor: "pointer", border: "1px solid #f59e0b" }} onClick={() => router.push("/app/exceptions")}>
          <p className="eyebrow">NEEDS REVIEW</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>73</h2>
          <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>Action Required · Open Queue →</span>
        </div>
        <div className="card" style={{ padding: "1.25rem", cursor: "pointer", border: "1px solid #ef4444" }} onClick={() => router.push("/app/exceptions")}>
          <p className="eyebrow">HIGH RISK ANOMALIES</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>35</h2>
          <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>21 duplicates, 14 unusual · Inspect →</span>
        </div>
      </div>

      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Applications &amp; Modules</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {APPLICATIONS.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.href}
              href={app.href}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Icon size={18} style={{ color: "var(--green)" }} />
                <ArrowRight size={15} style={{ color: "var(--muted)" }} />
              </div>
              <strong style={{ fontSize: "1rem", color: "var(--ink)" }}>{app.title}</strong>
              <span className="subtle" style={{ fontSize: "0.85rem" }}>
                {app.desc}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>AI Value &amp; Performance Metrics</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span className="subtle">Extraction Accuracy</span>
              <strong>99.2%</strong>
            </div>
            <div style={{ width: "100%", height: "4px", background: "#e5e7eb", borderRadius: "2px" }}>
              <div style={{ width: "99.2%", height: "100%", background: "#10b981", borderRadius: "2px" }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span className="subtle">Match Precision / Recall</span>
              <strong>98.5% / 96.0%</strong>
            </div>
            <div style={{ width: "100%", height: "4px", background: "#e5e7eb", borderRadius: "2px" }}>
              <div style={{ width: "98.5%", height: "100%", background: "#f59e0b", borderRadius: "2px" }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span className="subtle">False-Positive Anomaly Rate</span>
              <strong>1.2%</strong>
            </div>
            <div style={{ width: "100%", height: "4px", background: "#e5e7eb", borderRadius: "2px" }}>
              <div style={{ width: "1.2%", height: "100%", background: "#ef4444", borderRadius: "2px" }}></div>
            </div>
          </div>
        </div>

        <hr style={{ margin: "2rem 0", borderColor: "var(--line)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Avg Processing Time</p>
            <strong style={{ fontSize: "1.5rem" }}>1.4s</strong>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Avg Exception-Resolution</p>
            <strong style={{ fontSize: "1.5rem" }}>45s</strong>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Customer Corrections (30d)</p>
            <strong style={{ fontSize: "1.5rem" }}>142</strong>
            <span style={{ fontSize: "0.8rem", color: "#10b981", display: "block" }}>Improving models...</span>
          </div>
        </div>
      </div>
    </main>
  );
}
