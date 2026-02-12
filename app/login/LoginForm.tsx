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
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/60">Email</span>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#7C3AED] focus:outline-none"
          placeholder="toi@email.com"
          disabled={submitting}
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-[#7C3AED] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Envoi..." : "Envoyer le lien magique"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
