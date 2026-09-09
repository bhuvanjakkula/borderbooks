import Link from "next/link";
import { BarChart3, CreditCard, FilePlus2, History, Settings, TrendingUp } from "lucide-react";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" href="/app">BorderBooks</Link>
        <nav className="nav" aria-label="Workspace">
          <Link href="/app"><History size={15} /> <span className="hide-mobile">Runs</span></Link>
          <Link href="/app/fx-rates"><BarChart3 size={15} /> <span className="hide-mobile">FX Rates</span></Link>
          <Link href="/app/stripe-split"><TrendingUp size={15} /> <span className="hide-mobile">FX Split</span></Link>
          <Link href="/app/settings"><Settings size={15} /> <span className="hide-mobile">Settings</span></Link>
          <Link href="/app/billing"><CreditCard size={15} /> <span className="hide-mobile">Billing</span></Link>
          <Link className="button small" href="/app/new"><FilePlus2 size={15} /> New run</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
