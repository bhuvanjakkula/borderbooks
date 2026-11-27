"use client";
import { Check, AlertTriangle, RotateCcw } from "lucide-react";
import { useState } from "react";

type ExceptionItem = {
  id: string;
  supplier: string;
  amount: string;
  issue: string;
  confidence: number;
  explanation: { text: string; status: "pass" | "fail" }[];
};

const initialExceptions: ExceptionItem[] = [
  {
    id: "INV-4921",
    supplier: "Acme Corp",
    amount: "$1,750.00",
    issue: "Amount Mismatch",
    confidence: 97,
    explanation: [
      { text: "Supplier exact match", status: "pass" },
      { text: "PO #4421 exact match", status: "pass" },
      { text: "Currency exact (USD)", status: "pass" },
      { text: "Total differs by $15.00", status: "fail" },
      { text: "Tax differs by $2.70", status: "fail" },
    ],
  },
  {
    id: "INV-8832",
    supplier: "Global Tech",
    amount: "$4,200.00",
    issue: "Suspected Duplicate",
    confidence: 82,
    explanation: [
      { text: "Supplier exact match", status: "pass" },
      { text: "Amount exact match", status: "pass" },
      { text: "Date within 3 days of INV-8830", status: "fail" },
      { text: "Invoice number is 1 digit off", status: "fail" },
    ],
  },
];

export default function InvoiceExceptions() {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(initialExceptions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftSupplier, setDraftSupplier] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftIssue, setDraftIssue] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const resolve = (id: string, action: "approved" | "rejected") => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    setStatusMessage(`Invoice ${id} marked as ${action}.`);
  };

  const startEdit = (exc: ExceptionItem) => {
    setEditingId(exc.id);
    setDraftSupplier(exc.supplier);
    setDraftAmount(exc.amount);
    setDraftIssue(exc.issue);
  };

  const saveEdit = (id: string) => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              supplier: draftSupplier.trim() || item.supplier,
              amount: draftAmount.trim() || item.amount,
              issue: draftIssue.trim() || item.issue,
            }
          : item
      )
    );
    setEditingId(null);
    setStatusMessage(`Updated fields for ${id}.`);
  };

  return (
    <main className="page narrow">
      <div className="page-head">
        <div>
          <p className="eyebrow">02 / HUMAN IN THE LOOP</p>
          <h1>Exceptions Queue</h1>
          <p className="subtle">
            Review flagged invoices. Approve, reject, or edit extracted fields before posting to your reconciliation ledger.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className="notice"
          style={{
            border: "1px solid var(--green)",
            background: "var(--green-soft)",
            color: "var(--green)",
          }}
        >
          {statusMessage}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
        {exceptions.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <h3 style={{ color: "#10b981" }}>Inbox Zero!</h3>
            <p className="subtle" style={{ marginBottom: "1.5rem" }}>
              All flagged invoices have been processed or reviewed.
            </p>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setExceptions(initialExceptions);
                setStatusMessage("");
              }}
            >
              <RotateCcw size={15} /> Restore Sample Queue
            </button>
          </div>
        ) : (
          exceptions.map((exc) => (
            <div key={exc.id} className="card" style={{ borderLeft: "4px solid #f59e0b", padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1.25rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "1.25rem",
                      marginBottom: "0.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {exc.supplier} - {exc.id}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        background: "#fef3c7",
                        color: "#b45309",
                        borderRadius: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {exc.issue}
                    </span>
                  </h3>
                  <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 0 }}>{exc.amount}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>
                    AI CONFIDENCE
                  </p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0, color: exc.confidence > 90 ? "#10b981" : "#f59e0b" }}>
                    {exc.confidence}%
                  </p>
                </div>
              </div>

              {editingId === exc.id && (
                <div
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1.25rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    Supplier
                    <input
                      value={draftSupplier}
                      onChange={(e) => setDraftSupplier(e.target.value)}
                      style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--line)", background: "#fff" }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    Amount
                    <input
                      value={draftAmount}
                      onChange={(e) => setDraftAmount(e.target.value)}
                      style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--line)", background: "#fff" }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    Issue Label
                    <input
                      value={draftIssue}
                      onChange={(e) => setDraftIssue(e.target.value)}
                      style={{ height: 36, padding: "0 10px", borderRadius: 6, border: "1px solid var(--line)", background: "#fff" }}
                    />
                  </label>
                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button type="button" className="button small" onClick={() => saveEdit(exc.id)}>
                      Save Changes
                    </button>
                    <button type="button" className="button secondary small" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  background: "rgba(0,0,0,0.02)",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  border: "1px solid #eee",
                }}
              >
                <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
                  EXPLANATION TRACE
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {exc.explanation.map((exp, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem",
                        color: exp.status === "pass" ? "#166534" : "#991b1b",
                      }}
                    >
                      {exp.status === "pass" ? <Check size={16} /> : <AlertTriangle size={16} />}
                      {exp.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="button"
                  style={{ background: "#10b981", borderColor: "#10b981" }}
                  onClick={() => resolve(exc.id, "approved")}
                >
                  Approve Exception
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => resolve(exc.id, "rejected")}
                >
                  Reject &amp; Flag
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => startEdit(exc)}
                >
                  Edit Fields
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
