"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock, Sparkles } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }
    if (!token) {
      setError("Missing password reset token. Please request a fresh link from Forgot Password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, email, newPassword, confirmPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to update password.");
      }
      setSuccess(data.message ?? "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md w-full mx-auto my-12 bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-[#176b4d]/20 border border-[#176b4d]/30 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-[#10b981]" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-white mb-2">Update Password</h1>
        <p className="text-sm text-slate-400">
          Set a new password and confirm it to secure your BorderBooks account.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300">
          {error}
        </div>
      )}

      {success ? (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#176b4d]/15 border border-[#10b981]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
            <div className="text-sm text-slate-200 leading-relaxed">
              <p className="font-semibold text-white mb-1">Password Updated</p>
              <p className="text-slate-300">{success}</p>
            </div>
          </div>

          <Link
            href="/app/billing"
            className="h-12 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            Continue to Billing &amp; Plans <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="reset-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Registered Email ID
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={Boolean(initialEmail)}
              className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10b981] read-only:opacity-75"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="new-password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full h-12 pl-4 pr-11 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10b981]"
              />
              <button
                type="button"
                aria-label="Toggle new password visibility"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Confirmation Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-12 pl-4 pr-11 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#10b981]"
              />
              <button
                type="button"
                aria-label="Toggle confirmation password visibility"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-gradient-to-r from-[#176b4d] to-[#0a3a2a] hover:from-[#10b981] hover:to-[#176b4d] disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Update Password <ArrowRight size={16} /></>}
          </button>

          <div className="text-center text-xs text-slate-400">
            Need a new link?{" "}
            <Link href="/forgot-password" className="text-[#10b981] hover:underline font-medium">
              Request Forgot Password Link
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
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

      <Suspense
        fallback={
          <main className="max-w-md w-full mx-auto my-12 text-center text-slate-400">
            Loading password reset form…
          </main>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 pt-6 border-t border-white/10">
        Need assistance? Customer Support:{" "}
        <a href="mailto:contact@apolloaiglobalcompany.com" className="text-[#10b981] hover:underline font-medium">
          contact@apolloaiglobalcompany.com
        </a>
      </footer>
    </div>
  );
}
