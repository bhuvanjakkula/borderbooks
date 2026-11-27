"use client";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { asError } from "@/lib/errors";

export function UpgradeBanner() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upgrade() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: "PROFESSIONAL" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error ?? "Could not start checkout");
      window.location.assign(data.url);
    } catch (value) {
      setError(asError(value, "Could not start checkout").message);
      setBusy(false);
    }
  }

  return (
    <aside className="upgrade-banner" role="alert">
      <div>
        <strong>This run is over the Starter row limit.</strong>
        <span>Professional ($149/mo) supports up to 10,000 invoice and transaction rows per run.</span>
        {error && <small>{error}</small>}
      </div>
      <button className="button" onClick={upgrade} disabled={busy}>
        {busy ? "Opening checkout…" : <>Upgrade to Professional <ArrowUpRight size={15} /></>}
      </button>
    </aside>
  );
}
