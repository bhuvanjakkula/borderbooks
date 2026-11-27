"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Check,
  Lock,
  ExternalLink,
  Cpu,
  ScanText,
  Globe2,
  Split,
  Bot,
  ShieldCheck,
  Mail,
  KeyRound,
} from "lucide-react";

const TECHNOLOGIES = [
  {
    icon: Cpu,
    category: "Core Engine",
    title: "Deterministic & Fuzzy Matching Engine",
    description:
      "Multi-pass reconciliation combining exact reference matching, token similarity, configurable date/amount tolerance windows, and partial/split payment attribution.",
    capabilities: ["Exact & fuzzy reference scoring", "Short-payment & fee variance isolation", "Deterministic replayable runs"],
  },
  {
    icon: ScanText,
    category: "Document AI",
    title: "AI Invoice & Statement OCR",
    description:
      "Extract invoice numbers, line totals, tax amounts, currencies, and counterparties from PDF and image invoices with per-field confidence indicators.",
    capabilities: ["PDF & CSV unified Import Hub", "Per-field confidence badges", "Human-in-the-loop review before ingest"],
  },
  {
    icon: Globe2,
    category: "Treasury FX",
    title: "Multi-Currency Live & Historical FX",
    description:
      "Mid-market FX rate lookups with historical trend analytics and automated realized FX gain/loss attribution across cross-border settlements.",
    capabilities: ["Historical mid-market FX cache", "Basis-point spread & variance tracking", "Multi-currency invoice normalization"],
  },
  {
    icon: Split,
    category: "Payout Forensics",
    title: "Stripe, Wise & Payoneer FX Split",
    description:
      "Decompose batched processor payouts into gross sales, refunds, processing fees, net bank deposits, and FX legs for clean ledger posting.",
    capabilities: ["Stripe payout leg decomposition", "Wise & Payoneer statement parsers", "Balanced journal CSV & XLSX exports"],
  },
  {
    icon: Bot,
    category: "Operations",
    title: "AP Copilot & Exception Triage",
    description:
      "Flag suspected duplicate invoices, amount mismatches, and unallocated cash in a dedicated exceptions queue with explainable pass/fail traces.",
    capabilities: ["Duplicate & anomaly detection", "Natural-language AP Copilot queries", "One-click approve, reject & inline edit"],
  },
  {
    icon: ShieldCheck,
    category: "Compliance",
    title: "Zero-Trust Cryptographic Audit Ledger",
    description:
      "Every upload is SHA-256 fingerprinted and every match carries a plain-English explanation, backed by AES-256 encryption, RBAC, and 30-day auto-purge.",
    capabilities: ["Immutable audit event ledger", "Multi-role RBAC (Owner, Admin, Auditor)", "PDF workpapers & 30-day file deletion"],
  },
] as const;

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$49",
    badge: "Core Reconciliation",
    description: "For solo operators and lean finance teams automating invoice-to-bank matching.",
    featured: false,
    cta: "Subscribe to Starter",
    stripeUrl: "https://buy.stripe.com/7sY28jeFUfWt9L9gQS2oE13",
    features: [
      "1 workspace included",
      "Up to 2,000 rows per reconciliation run",
      "Deterministic invoice & bank CSV + PDF OCR matching",
      "Bank & generic statement parsers",
      "Explainable audit trail & XLSX / CSV journal exports",
      "30-day automatic upload deletion & zero bank scraping",
    ],
  },
  {
    name: "Professional",
    price: "$199",
    badge: "Most Popular",
    description: "For growing multi-currency businesses reconciling Stripe, Wise, Payoneer & bank payouts.",
    featured: true,
    cta: "Subscribe to Professional",
    stripeUrl: "https://buy.stripe.com/bJefZ9fJYh0x9L9bwy2oE12",
    features: [
      "Up to 5 workspaces & multi-user RBAC",
      "Up to 10,000 rows per reconciliation run",
      "Multi-source parsers (Bank, Stripe, Wise, Payoneer)",
      "Live & historical multi-currency FX rates",
      "Stripe & Forensic Payout FX Split analyzer",
      "AP Copilot exception triage, custom labels & PDF reports",
    ],
  },
  {
    name: "Enterprise",
    price: "$499",
    badge: "High-Volume Ops",
    description: "For high-volume finance operations requiring unlimited scale and compliance governance.",
    featured: false,
    cta: "Subscribe to Enterprise",
    stripeUrl: "https://buy.stripe.com/aFa3cngO24dL5uT0RU2oE11",
    features: [
      "Unlimited workspaces & enterprise RBAC",
      "Unlimited rows per high-volume batch run",
      "All Professional OCR, AP Copilot, FX & Forensic Split tools",
      "Audit-ready compliance workpapers & custom exports",
      "Dedicated onboarding & priority technical support",
      "Custom SLA & enterprise security review",
    ],
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen relative bg-[#030712] text-white overflow-x-hidden selection:bg-[#176b4d] selection:text-white">
      {/* Background glowing effects */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-[#176b4d] opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[40%] bg-[#0a3a2a] opacity-30 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <main className="min-h-screen relative flex flex-col md:flex-row">
        {/* Left side: Grand Branding */}
        <div className="relative flex-1 flex flex-col p-10 md:p-20 justify-between z-10 border-b md:border-b-0 md:border-r border-white/5">
          <header className="flex items-center justify-between gap-3 mb-16 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-[#176b4d]/20 backdrop-blur-md">
                <Sparkles className="text-[#10b981] w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                BorderBooks
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm text-slate-300 flex-wrap">
              <a href="#technologies" className="hover:text-[#10b981] transition-colors font-medium">
                Technologies
              </a>
              <a href="#pricing" className="hover:text-[#10b981] transition-colors font-medium">
                Pricing
              </a>
              <Link href="/forgot-password" className="hover:text-[#10b981] transition-colors font-medium">
                Forgot Password
              </Link>
              <a
                href="#pricing"
                className="px-4 py-2 rounded-lg bg-[#176b4d] hover:bg-[#10b981] text-white transition-all font-semibold"
              >
                Subscribe
              </a>
            </nav>
          </header>

          <section className="max-w-2xl my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176b4d]/10 border border-[#176b4d]/20 text-[#10b981] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              Next-Gen Financial Control &amp; Reconciliation
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.08] tracking-tight mb-8">
              Match invoices with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399]">
                absolute precision.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-light">
              Deterministically match uploaded invoice and bank files with AI OCR, multi-currency FX attribution, forensic Stripe payout splits, and an immutable audit trail.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#pricing"
                className="h-14 px-7 bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl inline-flex items-center justify-center gap-3 font-bold text-[15px] shadow-[0_0_20px_rgba(23,107,77,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
              >
                Choose a Plan to Get Started <ArrowRight size={18} />
              </a>
              <a
                href="#technologies"
                className="h-14 px-7 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl inline-flex items-center justify-center gap-2 font-semibold text-[15px] transition-all"
              >
                Explore Technologies
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <span className="text-[#10b981]">✦</span> Never moves money
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#10b981]">✦</span> Not accounting advice
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#10b981]">✦</span> No bank scraping
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#10b981]">✦</span> AES-256 privacy
              </span>
            </div>
          </section>
        </div>

        {/* Right side: Paid Subscription Gate Card */}
        <div className="relative flex-1 flex items-center justify-center p-8 md:p-16 z-10">
          <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-[#176b4d]/20 border border-[#176b4d]/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-3xl font-serif font-medium mb-2 text-white">Subscription Required</h2>
              <p className="text-sm text-slate-400">
                Select a monthly USD plan below to unlock the BorderBooks reconciliation dashboard, OCR engine, FX Rates, and Stripe Split tools.
              </p>
            </div>

            <div className="space-y-3 mb-7">
              {PRICING_PLANS.map((plan) => (
                <a
                  key={plan.name}
                  href={plan.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    plan.featured
                      ? "bg-[#176b4d]/20 border-[#10b981]/60 hover:bg-[#176b4d]/30"
                      : "bg-white/[0.03] border-white/10 hover:border-[#10b981]/50"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {plan.name} {plan.featured ? "· Popular" : ""}
                    </div>
                    <div className="text-xs text-slate-400">{plan.price} USD / month</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#10b981] shrink-0" />
                </a>
              ))}
            </div>

            <a
              href="#pricing"
              className="h-14 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[15px] shadow-[0_0_20px_rgba(23,107,77,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
            >
              Compare Full Plan Features <ArrowRight size={18} />
            </a>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2.5 text-center text-xs text-slate-400">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center gap-1.5 text-[#10b981] hover:underline font-medium"
              >
                <KeyRound size={13} /> Forgot Password? Update your password
              </Link>
              <span>
                Support:{" "}
                <a
                  href="mailto:contact@apolloaiglobalcompany.com"
                  className="text-slate-200 hover:text-[#10b981] underline"
                >
                  contact@apolloaiglobalcompany.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced Technologies & Applications Section */}
      <section id="technologies" className="relative z-10 border-t border-white/10 py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176b4d]/15 border border-[#176b4d]/30 text-[#10b981] text-xs font-bold tracking-widest uppercase mb-5">
              Advanced Technologies &amp; Applications
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-white">
              Six specialized engines in one financial-control platform
            </h2>
            <p className="text-base md:text-lg text-slate-400 font-light">
              Built for modern B2B finance teams, controllers, and audit firms handling multi-currency invoices, payment gateways, and regulatory workpapers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECHNOLOGIES.map((tech) => {
              const Icon = tech.icon;
              return (
                <article
                  key={tech.title}
                  className="rounded-2xl p-7 bg-white/[0.02] border border-white/10 hover:border-[#10b981]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-2.5 rounded-xl bg-[#176b4d]/20 border border-[#10b981]/30 text-[#10b981]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {tech.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-white mb-3">{tech.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">{tech.description}</p>
                  </div>
                  <ul className="space-y-2 pt-4 border-t border-white/10">
                    {tech.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="relative z-10 border-t border-white/10 py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176b4d]/15 border border-[#176b4d]/30 text-[#10b981] text-xs font-bold tracking-widest uppercase mb-5">
              Transparent Monthly Pricing · USD
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-white">
              Plans built for deterministic reconciliation
            </h2>
            <p className="text-base md:text-lg text-slate-400 font-light">
              Choose the tier that matches your monthly transaction volume, multi-currency FX workflows, and compliance reporting needs. All prices in US Dollars (USD) per month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${
                  plan.featured
                    ? "bg-gradient-to-b from-[#176b4d]/25 to-white/[0.03] border-2 border-[#10b981] shadow-[0_0_40px_rgba(16,185,129,0.18)]"
                    : "bg-white/[0.02] border border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="text-2xl font-serif font-medium text-white">{plan.name}</h3>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        plan.featured
                          ? "bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40"
                          : "bg-white/5 text-slate-300 border border-white/10"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-serif font-medium text-white">{plan.price}</span>
                    <span className="text-sm text-slate-400 font-medium">USD / month</span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-8">{plan.description}</p>

                  <ul className="space-y-3.5 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white shadow-[0_0_20px_rgba(23,107,77,0.4)]"
                      : "bg-white/5 hover:bg-white/10 border border-white/15 text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-slate-500">
            Statement data is never used for AI training. No bank scraping. Cancel or switch plans anytime via Stripe Billing Portal.
          </p>
        </div>
      </section>

      {/* Global Support & Account Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 md:px-16 bg-black/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#10b981] w-5 h-5" />
            <span className="font-serif font-semibold text-white">BorderBooks</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs">Deterministic Financial Reconciliation</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a href="#technologies" className="hover:text-[#10b981] transition-colors">
              Technologies
            </a>
            <a href="#pricing" className="hover:text-[#10b981] transition-colors">
              Pricing (USD)
            </a>
            <Link href="/forgot-password" className="hover:text-[#10b981] transition-colors">
              Forgot Password
            </Link>
            <a
              href="mailto:contact@apolloaiglobalcompany.com"
              className="inline-flex items-center gap-1.5 text-[#10b981] hover:underline font-semibold"
            >
              <Mail size={14} /> Customer Support: contact@apolloaiglobalcompany.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
