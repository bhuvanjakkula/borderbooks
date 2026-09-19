import Link from "next/link";
import { LayoutDashboard, AlertCircle, ShieldCheck, FilePlus2, Settings, CreditCard, Lock } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fafafa' }}>
      <header className="topbar" style={{ background: '#0f172a', color: 'white', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link className="brand" href="/app/dashboard" style={{ color: 'white' }}>
            <ShieldCheck size={20} style={{ color: '#10b981', marginRight: '0.5rem' }} />
            BorderBooks Copilot
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>
            <Lock size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Session Secured (AES-256)</span>
          </div>
        </div>
        <nav className="nav" aria-label="Workspace">
          <Link href="/app/dashboard" style={{ color: '#94a3b8' }}><LayoutDashboard size={15} /> <span className="hide-mobile">Dashboard</span></Link>
          <Link href="/app/exceptions" style={{ color: '#94a3b8' }}><AlertCircle size={15} /> <span className="hide-mobile">Exceptions</span></Link>
          <Link href="/app/security" style={{ color: '#10b981' }}><ShieldCheck size={15} /> <span className="hide-mobile">Audit Log</span></Link>
          <Link href="/app/settings" style={{ color: '#94a3b8' }}><Settings size={15} /> <span className="hide-mobile">Settings</span></Link>
          <Link className="button small" href="/app/new" style={{ background: '#10b981', color: 'white', border: 'none' }}><FilePlus2 size={15} /> Import Hub</Link>
          
          <div style={{ borderLeft: '1px solid #1e293b', marginLeft: '0.5rem', paddingLeft: '0.5rem' }}>
            <RoleSwitcher />
          </div>
        </nav>
      </header>
      <div style={{ flex: 1, padding: '2rem 0' }}>
        {children}
      </div>
      <footer style={{ background: '#0f172a', padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Lock size={14} /> SOC 2 Type II Certified</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ShieldCheck size={14} /> E2E Encryption</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14} /> Zero-Trust Architecture</span>
        </div>
      </footer>
    </div>
  );
}
