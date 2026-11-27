import Link from "next/link";
import {
  LayoutDashboard,
  AlertCircle,
  ShieldCheck,
  FilePlus2,
  Settings,
  CreditCard,
  Lock,
  BarChart3,
  TrendingUp,
  History,
  Mail,
} from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="shell"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "radial-gradient(circle at top right, #d1fae5 0%, #f8fafc 40%)",
      }}
    >
      <header
        className="topbar"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "auto",
          minHeight: "64px",
          padding: "8px 24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link className="brand" href="/app/dashboard" style={{ color: "var(--ink)", display: "inline-flex", alignItems: "center" }}>
            <ShieldCheck size={20} style={{ color: "var(--green)", marginRight: "0.5rem" }} />
            BorderBooks Copilot
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            <Lock size={12} style={{ color: "var(--green)" }} />
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--green)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              AES-256 Zero-Trust
            </span>
          </div>
        </div>
        <nav className="nav" aria-label="Workspace" style={{ flexWrap: "wrap", gap: "4px" }}>
          <Link href="/app/dashboard" style={{ color: "#475569" }}>
            <LayoutDashboard size={15} /> <span className="hide-mobile">Dashboard</span>
          </Link>
          <Link href="/app" style={{ color: "#475569" }}>
            <History size={15} /> <span className="hide-mobile">Runs</span>
          </Link>
          <Link href="/app/fx-rates" style={{ color: "#475569" }}>
            <BarChart3 size={15} /> <span className="hide-mobile">FX Rates</span>
          </Link>
          <Link href="/app/stripe-split" style={{ color: "#475569" }}>
            <TrendingUp size={15} /> <span className="hide-mobile">FX Split</span>
          </Link>
          <Link href="/app/exceptions" style={{ color: "#475569" }}>
            <AlertCircle size={15} /> <span className="hide-mobile">Exceptions</span>
          </Link>
          <Link href="/app/security" style={{ color: "#10b981", fontWeight: 600 }}>
            <ShieldCheck size={15} /> <span className="hide-mobile">Audit Log</span>
          </Link>
          <Link href="/app/settings" style={{ color: "#475569" }}>
            <Settings size={15} /> <span className="hide-mobile">Settings</span>
          </Link>
          <Link href="/app/billing" style={{ color: "#475569" }}>
            <CreditCard size={15} /> <span className="hide-mobile">Billing</span>
          </Link>
          <Link
            className="button small"
            href="/app/new"
            style={{ background: "#10b981", color: "white", border: "none" }}
          >
            <FilePlus2 size={15} /> Import Hub
          </Link>
          <RoleSwitcher />
        </nav>
      </header>
      <div style={{ flex: 1, padding: "2rem 0" }}>{children}</div>
      <footer
        style={{
          background: "transparent",
          padding: "1.5rem",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.82rem",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Lock size={14} style={{ color: "var(--green)" }} /> SOC 2 Type II Architecture
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <ShieldCheck size={14} style={{ color: "var(--green)" }} /> AES-256 E2E Encryption
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <AlertCircle size={14} style={{ color: "var(--green)" }} /> Zero-Trust Privacy
          </span>
          <Link href="/forgot-password" style={{ color: "var(--green)", textDecoration: "underline" }}>
            Forgot Password?
          </Link>
        </div>
        <div
          style={{
            marginTop: "0.85rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.45rem",
            flexWrap: "wrap",
          }}
        >
          <Mail size={14} style={{ color: "var(--green)" }} />
          <span style={{ fontWeight: 600 }}>Customer Support:</span>
          <a
            href="mailto:contact@apolloaiglobalcompany.com"
            style={{ color: "var(--green)", textDecoration: "underline", fontWeight: 600 }}
          >
            contact@apolloaiglobalcompany.com
          </a>
        </div>
      </footer>
    </div>
  );
}
