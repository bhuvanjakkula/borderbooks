"use client";

import { TrendingUp, TrendingDown, RefreshCw, ArrowLeftRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type RateResult = { base: string; quote: string; date: string; rate: number; source: string };
type HistoryPoint = { base: string; quote: string; date: string; rate: number; source: string };

const CURRENCIES = [
  "USD","EUR","GBP","JPY","AUD","CAD","CHF","HKD","SGD","INR",
  "MXN","BRL","ZAR","SEK","NOK","DKK","PLN","CZK","AED","SAR",
  "KWD","BHD","OMR","NZD","TRY","IDR","KRW","CNY",
];

function Sparkline({ data, width = 280, height = 56 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const last = data[data.length - 1];
  const first = data[0];
  const up = last >= first;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={up ? "var(--green)" : "#b63e35"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r={3} fill={up ? "var(--green)" : "#b63e35"} />
    </svg>
  );
}

export default function FxRatesPage() {
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("EUR");
  const [date, setDate] = useState("");
  const [rate, setRate] = useState<RateResult | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRate = useCallback(async () => {
    if (base === quote) { setRate({ base, quote, date: date || new Date().toISOString().slice(0,10), rate: 1, source: "identity" }); return; }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ base, quote });
      if (date) params.set("date", date);
      const [rateRes, histRes] = await Promise.all([
        fetch(`/api/fx/rates?${params}`),
        fetch(`/api/fx/rates?base=${base}&quote=${quote}&history=true&days=30`),
      ]);
      if (!rateRes.ok) { const d = await rateRes.json().catch(() => ({})); throw new Error(d.error ?? "Rate unavailable"); }
      const [rateData, histData] = await Promise.all([rateRes.json(), histRes.json().catch(() => ({ history: [] }))]);
      setRate(rateData);
      setHistory(histData.history ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch rate");
    } finally {
      setLoading(false);
    }
  }, [base, quote, date]);

  useEffect(() => { void fetchRate(); }, [fetchRate]);

  const swap = () => { setBase(quote); setQuote(base); };
  const histRates = history.map(h => h.rate);
  const change = histRates.length >= 2 ? ((histRates[histRates.length-1] - histRates[0]) / histRates[0] * 100) : 0;
  const up = change >= 0;

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Mid-Market Rates</p>
          <h1>FX Rate Lookup</h1>
          <p className="subtle">Live ECB mid-market rates via Frankfurter. Cached daily — no excess API calls.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="fx-controls card">
        <label>
          Base currency
          <select value={base} onChange={e => setBase(e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <button className="icon-button swap-btn" onClick={swap} aria-label="Swap currencies">
          <ArrowLeftRight size={18} />
        </button>
        <label>
          Quote currency
          <select value={quote} onChange={e => setQuote(e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Date <small>(leave blank for today)</small>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} max={new Date().toISOString().slice(0,10)} />
        </label>
        <button className="button" onClick={fetchRate} disabled={loading}>
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          {loading ? "Fetching…" : "Get Rate"}
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}

      {rate && (
        <div className="fx-result-grid">
          {/* Big rate card */}
          <div className="card fx-rate-card">
            <p className="eyebrow">Mid-market rate</p>
            <div className="fx-rate-display">
              <span className="fx-rate-value">
                {rate.rate === 1 && base === quote ? "1.000000" : rate.rate.toFixed(6)}
              </span>
              <span className="fx-pair">{base}/{quote}</span>
            </div>
            <p className="subtle fx-meta">
              Date: {rate.date} · Source: {rate.source}
            </p>
            {histRates.length >= 2 && (
              <div className={`fx-change ${up ? "up" : "down"}`}>
                {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {up ? "+" : ""}{change.toFixed(3)}% vs 30 days ago
              </div>
            )}
          </div>

          {/* Sparkline chart */}
          {histRates.length >= 2 && (
            <div className="card fx-sparkline-card">
              <p className="eyebrow">30-Day Trend</p>
              <div className="sparkline-wrap">
                <Sparkline data={histRates} width={340} height={80} />
              </div>
              <div className="sparkline-labels">
                <span>{history[0]?.date}</span>
                <span>{history[history.length-1]?.date}</span>
              </div>
              <div className="sparkline-stats">
                <div><span>Min</span><strong>{Math.min(...histRates).toFixed(6)}</strong></div>
                <div><span>Max</span><strong>{Math.max(...histRates).toFixed(6)}</strong></div>
                <div><span>Avg</span><strong>{(histRates.reduce((a,b) => a+b,0)/histRates.length).toFixed(6)}</strong></div>
              </div>
            </div>
          )}

          {/* Quick conversion table */}
          <div className="card fx-quick-card">
            <p className="eyebrow">Quick Conversions</p>
            <table className="quick-table">
              <thead><tr><th>{base} amount</th><th>{quote} equivalent</th></tr></thead>
              <tbody>
                {[1, 10, 100, 500, 1000, 5000, 10000, 50000].map(amt => (
                  <tr key={amt}>
                    <td>{amt.toLocaleString()}</td>
                    <td>{(amt * rate.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
