"use client";
import { ShieldCheck, ShieldAlert, Key, Globe, Lock } from 'lucide-react';

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
    <main className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">03 / COMPLIANCE</p>
          <h1>Security & Audit Log</h1>
          <p className="subtle">Immutable history of all financial mutations. Tenant-isolated and encrypted at rest.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}><ShieldCheck size={24} /></div>
          <div><p className="eyebrow" style={{ margin: 0 }}>RBAC STATUS</p><strong>Enforcing</strong></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}><Key size={24} /></div>
          <div><p className="eyebrow" style={{ margin: 0 }}>MFA / PASSKEYS</p><strong>Required</strong></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}><Lock size={24} /></div>
          <div><p className="eyebrow" style={{ margin: 0 }}>DATA ENCRYPTION</p><strong>AES-256 GCM</strong></div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>EVENT ID / WHEN</th>
              <th style={{ padding: '1rem' }}>WHO (ROLE)</th>
              <th style={{ padding: '1rem' }}>WHAT (MUTATION)</th>
              <th style={{ padding: '1rem' }}>DEVICE / IP</th>
              <th style={{ padding: '1rem' }}>AUTHORIZATION</th>
              <th style={{ padding: '1rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <code style={{ color: '#666' }}>{log.id}</code><br/>
                  <span className="subtle" style={{ fontSize: '0.8rem' }}>{log.when}</span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <strong>{log.who}</strong><br/>
                  <span className="subtle" style={{ fontSize: '0.8rem' }}>{log.role}</span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <strong>{log.what}</strong>
                  {log.before && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fef2f2', color: '#991b1b', borderRadius: '4px', fontSize: '0.8rem' }}>
                      <del>{log.before}</del>
                    </div>
                  )}
                  <div style={{ marginTop: log.before ? '0.25rem' : '0.5rem', padding: '0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {log.after}
                  </div>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Globe size={14} style={{ color: '#666' }} />
                    <span className="subtle">{log.deviceIp}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#f3f4f6', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {log.authz}
                  </span>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                  {log.status === 'SUCCESS' && <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ShieldCheck size={16}/> {log.status}</span>}
                  {log.status === 'DENIED' && <span style={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ShieldAlert size={16}/> {log.status}</span>}
                  {log.status === 'PENDING DUAL-APPROVAL' && <span style={{ color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Lock size={16}/> {log.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
