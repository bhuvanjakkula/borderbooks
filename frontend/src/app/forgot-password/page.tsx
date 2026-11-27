"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    email: string;
    resetUrl: string;
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to generate password update link.");
      }
      setResult({
        email: data.email,
        resetUrl: data.resetUrl,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate password update link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between p-6 md:p-12">
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <Sparkles className="text-[#10b981] w-5 h-5" />
          </div>
          <span className="font-bold text-xl font-serif text-white">BorderBooks</span>
        </Link>
        <Link href="/" className="text-sm text-slate-400 hover:text-[#10b981] inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-12 bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-[#176b4d]/20 border border-[#176b4d]/30 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-[#10b981]" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-white mb-2">Forgot Password</h1>
          <p className="text-sm text-slate-400">
            Enter your registered email ID to receive a secure Update Password link.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
            {error}
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="registered-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Registered Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="registered-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-12 pl-11 pr-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Get Update Password Link <ArrowRight size={16} /></>}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#176b4d]/15 border border-[#10b981]/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
              <div className="text-sm text-slate-200 leading-relaxed">
                <p className="font-semibold text-white mb-1">Update Password Link Ready</p>
                <p className="text-slate-300">{result.message}</p>
              </div>
            </div>

            <Link
              href={result.resetUrl}
              className="h-12 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              Open Update Password Link <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setEmail("");
              }}
              className="w-full text-xs text-slate-400 hover:text-white underline"
            >
              Use a different email address
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 pt-6 border-t border-white/10">
        Need assistance? Customer Support:{" "}
        <a href="mailto:contact@apolloaiglobalcompany.com" className="text-[#10b981] hover:underline font-medium">
          contact@apolloaiglobalcompany.com
        </a>
      </footer>
    </div>
  );
}
