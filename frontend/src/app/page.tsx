"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Check, ShieldCheck, BarChart3, TrendingUp, FileSpreadsheet } from "lucide-react";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$49",
    badge: "Core Reconciliation",
    description: "For solo operators and lean finance teams automating invoice-to-bank matching.",
    featured: false,
    cta: "Start with Starter",
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
    name: "Professional",
    price: "$149",
    badge: "Most Popular",
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
    name: "Enterprise",
    price: "$499",
    badge: "High-Volume Ops",
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

export default function Home() {
  return (
    <div className="min-h-screen relative bg-[#030712] text-white overflow-x-hidden selection:bg-[#176b4d] selection:text-white">
      {/* Background glowing effects */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-[#176b4d] opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[40%] bg-[#0a3a2a] opacity-30 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <main className="min-h-screen relative flex flex-col md:flex-row">
        {/* Left side: Grand Branding */}
        <div className="relative flex-1 flex flex-col p-10 md:p-20 justify-between z-10 border-b md:border-b-0 md:border-r border-white/5">
          <header className="flex items-center justify-between gap-3 mb-16 animate-fade-in-down">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-[#176b4d]/20 backdrop-blur-md">
                <Sparkles className="text-[#10b981] w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                BorderBooks
              </span>
            </div>
            <nav className="flex items-center gap-5 text-sm text-slate-300">
              <a href="#pricing" className="hover:text-[#10b981] transition-colors font-medium">
                Pricing
              </a>
              <Link
                href="/app"
                className="px-4 py-2 rounded-lg bg-[#176b4d] hover:bg-[#10b981] text-white transition-all font-semibold"
              >
                Enter App
              </Link>
            </nav>
          </header>

          <section className="max-w-2xl my-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176b4d]/10 border border-[#176b4d]/20 text-[#10b981] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              Next-Gen Reconciliation · Direct Access
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-medium leading-[1.1] tracking-tight mb-8">
              Match invoices with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399]">
                absolute precision.
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-10 font-light">
              Deterministically match uploaded invoice and bank files, backed by an immutable audit trail that shows exactly why every pair was proposed.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/app"
                className="h-14 px-7 bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl inline-flex items-center justify-center gap-3 font-bold text-[15px] shadow-[0_0_20px_rgba(23,107,77,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
              >
                Enter BorderBooks <ArrowRight size={18} />
              </Link>
              <a
                href="#pricing"
                className="h-14 px-7 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl inline-flex items-center justify-center gap-2 font-semibold text-[15px] transition-all"
              >
                View Monthly Plans (USD)
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
                <span className="text-[#10b981]">✦</span> Absolute privacy
              </span>
            </div>
          </section>
        </div>

        {/* Right side: Instant Direct Workspace Access Card (No Clerk required) */}
        <div className="relative flex-1 flex items-center justify-center p-8 md:p-16 z-10">
          <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-[#176b4d]/20 border border-[#176b4d]/30 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-3xl font-serif font-medium mb-2 text-white">Direct Workspace Access</h2>
              <p className="text-sm text-slate-400">
                Launch straight into BorderBooks reconciliation tools—no sign-up barrier required.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <Link
                href="/app/new"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#10b981]/50 transition-all"
              >
                <FileSpreadsheet className="w-5 h-5 text-[#10b981] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">New Reconciliation Run</div>
                  <div className="text-xs text-slate-400">Upload invoices &amp; bank/Stripe/Wise CSVs</div>
                </div>
              </Link>
              <Link
                href="/app/fx-rates"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#10b981]/50 transition-all"
              >
                <BarChart3 className="w-5 h-5 text-[#10b981] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Multi-Currency FX Rates</div>
                  <div className="text-xs text-slate-400">Historical mid-market rates &amp; variance tracking</div>
                </div>
              </Link>
              <Link
                href="/app/stripe-split"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#10b981]/50 transition-all"
              >
                <TrendingUp className="w-5 h-5 text-[#10b981] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Stripe Payout FX Split</div>
                  <div className="text-xs text-slate-400">Separate sales, fees, deposits &amp; FX gain/loss</div>
                </div>
              </Link>
            </div>

            <Link
              href="/app"
              className="h-14 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl flex items-center justify-center gap-3 font-bold text-[15px] shadow-[0_0_20px_rgba(23,107,77,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
            >
              Open Workspace Directly <ArrowRight size={18} />
            </Link>

            <div className="mt-5 text-center text-xs text-slate-400">
              Manage subscriptions anytime in{" "}
              <Link href="/app/billing" className="text-[#10b981] font-bold hover:underline ml-1">
                Billing &amp; Plans
              </Link>
            </div>
          </div>
        </div>
      </main>

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

                  <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    {plan.description}
                  </p>

                  <ul className="space-y-3.5 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/app/billing"
                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white shadow-[0_0_20px_rgba(23,107,77,0.4)]"
                      : "bg-white/5 hover:bg-white/10 border border-white/15 text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-slate-500">
            Statement data is never used for AI training. No bank scraping. Cancel or switch plans anytime via Stripe Billing Portal.
          </p>
        </div>
      </section>
    </div>
  );
}
