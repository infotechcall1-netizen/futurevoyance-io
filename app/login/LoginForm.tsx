"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  callbackUrl: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    setSubmitting(true);
    setError(null);
    try {
      await signIn("email", {
        email: value,
        callbackUrl,
        redirect: true,
      });
    } catch {
      setError("Impossible d'envoyer le lien magique.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</span>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          placeholder="toi@email.com"
          disabled={submitting}
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-slate-50 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Envoi..." : "Envoyer le lien magique"}
      </button>
      {error && <p className="text-sm text-rose-300/90">{error}</p>}
    </form>
  );
}
