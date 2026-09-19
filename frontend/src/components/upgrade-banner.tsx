"use client";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export function UpgradeBanner() {
  return (
    <aside className="upgrade-banner" role="alert" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#0f172a', border: '1px solid #1e293b', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
      <div>
        <strong style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} style={{ color: '#f59e0b' }} />
          Plan Limit Reached
        </strong>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Your current plan cannot process this many rows. Please select a license to upgrade your capacity.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solo License</h4>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>Up to 5,000 transactions / run</p>
          <a href="https://buy.stripe.com/test_00w28japEcKhaPd3022oE04" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="button secondary" style={{ width: '100%', background: 'transparent', color: '#10b981', border: '1px solid #10b981' }}>
              Upgrade to Solo <ArrowUpRight size={15} />
            </button>
          </a>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Firm / Company License</h4>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>Unlimited volume & RBAC support</p>
          <a href="https://buy.stripe.com/test_fZu00bgO211z3mLbwy2oE05" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="button" style={{ width: '100%', background: '#f59e0b', color: 'white', border: 'none' }}>
              Upgrade to Firm <ArrowUpRight size={15} />
            </button>
          </a>
        </div>
      </div>
    </aside>
  );
}
