"use client";

import {
  TrendingUp, TrendingDown, Download, Loader2, AlertCircle,
  DollarSign, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { useState } from "react";

type SplitLeg = {
  type: "sale" | "fee" | "refund" | "other";
  id: string;
  description: string;
  currency: string;
  amountMinor: number;
  settlementAmountMinor: number;
  settlementCurrency: string;
  fxRate: number;
  fxGainLossMinor: number;
  created: string;
};

type PayoutSplit = {
  payoutId: string;
  settlementCurrency: string;
  totalSaleMinor: number;
  totalFeeMinor: number;
  totalDepositMinor: number;
  totalFxGainMinor: number;
  totalFxLossMinor: number;
  legs: SplitLeg[];
  midRateUsed: Record<string, number>;
};

const EXP: Record<string, number> = { USD:2, EUR:2, GBP:2, JPY:0, KRW:0, KWD:3, BHD:3, AUD:2, CAD:2, CHF:2, HKD:2, SGD:2, INR:2, AED:2, SAR:2 };
function major(minor: number, ccy: string): string {
  const e = EXP[ccy.toUpperCase()] ?? 2;
  if (e === 0) return minor.toString();
  const neg = minor < 0, abs = Math.abs(minor).toString().padStart(e + 1, "0");
  return `${neg ? "-" : ""}${abs.slice(0, -e)}.${abs.slice(-e)}`;
}
function fmt(minor: number, ccy: string, sign = false): string {
  const m = major(minor, ccy);
  return `${sign && minor > 0 ? "+" : ""}${ccy} ${m}`;
}

function exportSplitCsv(split: PayoutSplit): void {
  const headers = ["ID","Type","Description","Currency","Amount","SettlementCurrency","SettlementAmount","FxRate","FxGainLoss","Created"];
  const rows = split.legs.map(l => [
    l.id, l.type, `"${l.description.replace(/"/g,'""')}"`,
    l.currency, major(l.amountMinor, l.currency),
    l.settlementCurrency, major(l.settlementAmountMinor, l.settlementCurrency),
    l.fxRate.toFixed(6), major(l.fxGainLossMinor, l.settlementCurrency),
    l.created,
  ].join(","));
  const csv = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `stripe-split-${split.payoutId}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function LegTypeIcon({ type }: { type: SplitLeg["type"] }) {
  if (type === "sale") return <ArrowUpRight size={14} className="leg-icon sale" />;
  if (type === "refund") return <ArrowDownRight size={14} className="leg-icon refund" />;
  if (type === "fee") return <Minus size={14} className="leg-icon fee" />;
  return <DollarSign size={14} className="leg-icon other" />;
}

export default function StripeSplitPage() {
  const [payoutId, setPayoutId] = useState("");
  const [split, setSplit] = useState<PayoutSplit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stripeConfigured = true; // API will return 400 if not configured

  async function fetchSplit() {
    if (!payoutId.startsWith("po_")) { setError("Payout ID must start with 'po_'"); return; }
    setLoading(true); setError(""); setSplit(null);
    try {
      const res = await fetch("/api/stripe-split", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payoutId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch split");
      setSplit(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const netFx = split ? split.totalFxGainMinor - split.totalFxLossMinor : 0;

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Stripe Reconciliation</p>
          <h1>Payout FX Split</h1>
          <p className="subtle">
            Decompose any Stripe payout into sale / deposit / fee / FX gain-loss legs.
            Mid-market rates from ECB — reveals the true cost of currency conversion.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="split-input card">
        <label>
          Stripe Payout ID
          <div className="split-input-row">
            <input
              id="payout-id"
              value={payoutId}
              onChange={e => setPayoutId(e.target.value)}
              placeholder="po_1ABcDE2fGhIjKL3MnOpQrSt"
              onKeyDown={e => e.key === "Enter" && void fetchSplit()}
            />
            <button className="button" onClick={fetchSplit} disabled={loading || !payoutId}>
              {loading ? <Loader2 size={15} className="spin" /> : <TrendingUp size={15} />}
              {loading ? "Loading…" : "Analyse Payout"}
            </button>
          </div>
        </label>
        <p className="subtle" style={{ margin: 0, fontSize: 12 }}>
          Requires <code>STRIPE_SECRET_KEY</code> in environment. Payout must belong to your Stripe account.
        </p>
      </div>

      {error && (
        <div className="notice error" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {split && (
        <>
          {/* Summary cards */}
          <div className="split-summary">
            <div className="card split-stat">
              <span>Total Sales</span>
              <strong>{fmt(split.totalSaleMinor, split.legs.find(l=>l.type==="sale")?.currency ?? split.settlementCurrency)}</strong>
              <small>Gross receipts across all charges</small>
            </div>
            <div className="card split-stat">
              <span>Total Fees</span>
              <strong className="red">{fmt(split.totalFeeMinor, split.settlementCurrency)}</strong>
              <small>Stripe processing fees deducted</small>
            </div>
            <div className="card split-stat">
              <span>Deposited</span>
              <strong>{fmt(split.totalDepositMinor, split.settlementCurrency)}</strong>
              <small>Net amount in {split.settlementCurrency}</small>
            </div>
            <div className={`card split-stat ${netFx >= 0 ? "gain" : "loss"}`}>
              <span>FX vs Mid-Market</span>
              <strong className={netFx >= 0 ? "green" : "red"}>
                {netFx >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {fmt(Math.abs(netFx), split.settlementCurrency, false)}
              </strong>
              <small>{netFx >= 0 ? "Favourable vs ECB mid" : "Cost vs ECB mid-market"}</small>
            </div>
          </div>

          {/* Mid rates used */}
          {Object.keys(split.midRateUsed).length > 0 && (
            <div className="card fx-rates-used">
              <p className="eyebrow" style={{ marginBottom: 8 }}>Mid-market rates used (ECB)</p>
              <div className="rate-chips">
                {Object.entries(split.midRateUsed).map(([pair, r]) => (
                  <span key={pair} className="rate-chip">
                    <strong>{pair}</strong> {r.toFixed(6)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Legs table */}
          <div className="card table-wrap" style={{ marginTop: 16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 10px" }}>
              <p className="eyebrow" style={{ margin:0 }}>Balance Transaction Legs ({split.legs.length})</p>
              <button className="button secondary small" onClick={() => exportSplitCsv(split)}>
                <Download size={13} /> Export CSV
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Currency</th>
                  <th style={{ textAlign:"right" }}>Amount</th>
                  <th style={{ textAlign:"right" }}>Settled ({split.settlementCurrency})</th>
                  <th style={{ textAlign:"right" }}>FX Rate</th>
                  <th style={{ textAlign:"right" }}>FX Gain/Loss</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {split.legs.map(leg => (
                  <tr key={leg.id} className={`leg-row leg-${leg.type}`}>
                    <td><div style={{ display:"flex", alignItems:"center", gap:5 }}><LegTypeIcon type={leg.type} />{leg.type}</div></td>
                    <td><code style={{ fontSize:10 }}>{leg.id.slice(0,20)}…</code></td>
                    <td style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{leg.description}</td>
                    <td>{leg.currency}</td>
                    <td style={{ textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{major(leg.amountMinor, leg.currency)}</td>
                    <td style={{ textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{major(leg.settlementAmountMinor, leg.settlementCurrency)}</td>
                    <td style={{ textAlign:"right" }}>{leg.currency === leg.settlementCurrency ? "—" : leg.fxRate.toFixed(6)}</td>
                    <td style={{ textAlign:"right", color: leg.fxGainLossMinor >= 0 ? "var(--green)" : "#b63e35", fontWeight: 600 }}>
                      {leg.currency === leg.settlementCurrency ? "—" : fmt(leg.fxGainLossMinor, leg.settlementCurrency, true)}
                    </td>
                    <td style={{ fontSize:11, color:"var(--muted)" }}>{new Date(leg.created).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
