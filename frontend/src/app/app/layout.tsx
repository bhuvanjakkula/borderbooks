import Link from "next/link";
import { LayoutDashboard, AlertCircle, ShieldCheck, FilePlus2, Settings, CreditCard } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" href="/app/dashboard">BorderBooks AP Copilot</Link>
        <nav className="nav" aria-label="Workspace">
          <Link href="/app/dashboard"><LayoutDashboard size={15} /> <span className="hide-mobile">Dashboard</span></Link>
          <Link href="/app/exceptions"><AlertCircle size={15} /> <span className="hide-mobile">Exceptions</span></Link>
          <Link href="/app/security" style={{ color: 'var(--accent-emerald, #10b981)' }}><ShieldCheck size={15} /> <span className="hide-mobile">Audit Log</span></Link>
          <Link href="/app/settings"><Settings size={15} /> <span className="hide-mobile">Settings</span></Link>
          <Link href="/app/billing"><CreditCard size={15} /> <span className="hide-mobile">Billing</span></Link>
          <Link className="button small" href="/app/new"><FilePlus2 size={15} /> Import Hub</Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Finance Admin</span>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
