"use client";
import { ShieldCheck, ShieldAlert, Key, Globe, Lock, Activity, Database, Server } from 'lucide-react';

type LogEvent = {
  id: string;
  who: string;
  role: string;
  what: string;
  when: string;
  deviceIp: string;
  before: string | null;
  after: string;
  authz: string;
  status: 'SUCCESS' | 'DENIED' | 'PENDING DUAL-APPROVAL';
};

const auditLogs: LogEvent[] = [
  {
    id: 'evt_99831',
    who: 'alice@borderbooks.com',
    role: 'Finance Admin',
    what: 'Vendor Bank Account Change',
    when: '2026-09-19T14:32:01Z',
    deviceIp: '192.168.1.105 (Mac OS)',
    before: 'Acct: ****4421, Routing: 021000021',
    after: 'Acct: ****9982, Routing: 122000661',
    authz: 'MFA_VERIFIED (Passkey)',
    status: 'PENDING DUAL-APPROVAL'
  },
  {
    id: 'evt_99830',
    who: 'system_matcher',
    role: 'AI Engine',
    what: 'Auto-Matched Invoice INV-4921',
    when: '2026-09-19T14:30:15Z',
    deviceIp: 'Internal Network',
    before: null,
    after: 'Matched with PO-4421',
    authz: 'SYSTEM_ROLE',
    status: 'SUCCESS'
  },
  {
    id: 'evt_99829',
    who: 'bob@borderbooks.com',
    role: 'Read-only',
    what: 'Attempted to approve payment',
    when: '2026-09-19T14:15:00Z',
    deviceIp: '203.0.113.45 (Windows)',
    before: 'Payment Pending',
    after: 'Payment Approved',
    authz: 'RBAC_EVALUATION',
    status: 'DENIED'
  }
];

export default function SecurityAuditLog() {
  return (
    <main className="page" style={{ background: '#020617', color: '#e2e8f0', minHeight: '100vh', margin: '-2rem 0', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> ZERO-TRUST ARCHITECTURE</p>
          <h1 style={{ color: '#f8fafc', fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Immutable Audit Ledger</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: 0 }}>Cryptographically signed history of all financial mutations. Tenant-isolated and AES-256 encrypted at rest.</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Activity size={16} /> SYSTEM NORMAL
          </div>
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>Last sync: {new Date().toISOString()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}><ShieldCheck size={24} /></div>
          <div><p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>RBAC EVALUATION</p><strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Enforcing Strict</strong></div>
        </div>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}><Key size={24} /></div>
          <div><p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>MFA / PASSKEYS</p><strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Required Globally</strong></div>
        </div>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', color: '#a855f7' }}><Database size={24} /></div>
          <div><p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>DATA ENCRYPTION</p><strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>AES-256 GCM</strong></div>
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ background: '#020617', borderBottom: '1px solid #1e293b' }}>
            <tr>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>EVENT ID / UTC TIME</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>IDENTITY</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>MUTATION / FORENSICS</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ORIGIN</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>AUTHZ TRACE</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '1rem', verticalAlign: 'top', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                    <Server size={12} /> {log.id}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>{log.when}</span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <strong style={{ color: '#e2e8f0' }}>{log.who}</strong><br/>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Role: {log.role}</span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.5rem' }}>{log.what}</strong>
                  {log.before && (
                    <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                      <del>{log.before}</del>
                    </div>
                  )}
                  <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#86efac', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {log.after}
                  </div>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    <Globe size={14} style={{ color: '#64748b' }} />
                    {log.deviceIp}
                  </div>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#1e293b', color: '#94a3b8', borderRadius: '4px', fontFamily: 'monospace', border: '1px solid #334155' }}>
                    {log.authz}
                  </span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  {log.status === 'SUCCESS' && <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><ShieldCheck size={16}/> {log.status}</span>}
                  {log.status === 'DENIED' && <span style={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><ShieldAlert size={16}/> {log.status}</span>}
                  {log.status === 'PENDING DUAL-APPROVAL' && <span style={{ color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Lock size={16}/> {log.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
