"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type AuthFormProps = {
  callbackUrl: string;
};

export default function AuthForm({ callbackUrl }: AuthFormProps) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleOAuth(provider: "google" | "facebook") {
    setSubmitting(true);
    setError(null);
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError(`Erreur lors de la connexion avec ${provider}.`);
      setSubmitting(false);
    }
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isSignup) {
        // Signup flow: call register endpoint
        if (!formData.acceptTerms) {
          setError("Tu dois accepter les CGU pour créer un compte.");
          setSubmitting(false);
          return;
        }

        if (formData.password.length < 8) {
          setError("Le mot de passe doit contenir au moins 8 caractères.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur lors de la création du compte.");
          setSubmitting(false);
          return;
        }

        // After successful registration, sign in
        const signInResult = await signIn("credentials", {
          email: formData.email.trim(),
          password: formData.password,
          callbackUrl,
          redirect: false,
        });

        if (signInResult?.error) {
          setError("Compte créé, mais erreur de connexion. Réessaie.");
          setSubmitting(false);
          return;
        }

        // Redirect manually
        window.location.href = callbackUrl;
      } else {
        // Signin flow
        const result = await signIn("credentials", {
          email: formData.email.trim(),
          password: formData.password,
          callbackUrl,
          redirect: false,
        });

        if (result?.error) {
          setError("Email ou mot de passe incorrect.");
          setSubmitting(false);
          return;
        }

        // Redirect manually
        window.location.href = callbackUrl;
      }
    } catch {
      setError("Une erreur est survenue.");
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
      acceptTerms: false,
    });
  }

  return (
    <div className="space-y-6">
      {/* Toggle mode */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={toggleMode}
          disabled={submitting}
          className="text-[#6e4efb] underline underline-offset-2 hover:text-[#5a3dd4] disabled:opacity-50"
        >
          {isSignup ? "Déjà un compte ? Connexion" : "Pas de compte ? Créer un compte"}
        </button>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-[#E5E3DD] bg-white px-6 py-3 text-sm font-medium text-[#1A1A1A] shadow-sm transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuer avec Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("facebook")}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-[#E5E3DD] bg-white px-6 py-3 text-sm font-medium text-[#1A1A1A] shadow-sm transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continuer avec Facebook
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E3DD]"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#FBFAF7] px-2 text-[#1A1A1A]/50">Ou avec email</span>
        </div>
      </div>

      {/* Credentials form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {isSignup && (
          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/60">
              Nom d&apos;utilisateur *
            </span>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#6e4efb] focus:outline-none"
              placeholder="ton-pseudo"
              disabled={submitting}
            />
          </label>
        )}

        <label className="block space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/60">
            Email *
          </span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#6e4efb] focus:outline-none"
            placeholder="toi@email.com"
            disabled={submitting}
          />
        </label>

        {isSignup && (
          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/60">
              Téléphone (optionnel)
            </span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#6e4efb] focus:outline-none"
              placeholder="+33 6 12 34 56 78"
              disabled={submitting}
            />
          </label>
        )}

        <label className="block space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/60">
            Mot de passe *
          </span>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#6e4efb] focus:outline-none"
            placeholder="••••••••"
            disabled={submitting}
            minLength={8}
          />
          {isSignup && (
            <span className="text-xs text-[#1A1A1A]/50">Minimum 8 caractères</span>
          )}
        </label>

        {isSignup && (
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-[#E5E3DD] text-[#6e4efb] focus:ring-[#6e4efb]"
              disabled={submitting}
            />
            <span className="text-sm text-[#1A1A1A]/70">
              J&apos;accepte les{" "}
              <a
                href="/cgu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6e4efb] underline underline-offset-2 hover:text-[#5a3dd4]"
              >
                Conditions Générales d&apos;Utilisation
              </a>
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-[#6e4efb] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5a3dd4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Chargement..." : isSignup ? "Créer mon compte" : "Se connecter"}
        </button>

        {error && (
          <p className="rounded-sm border border-rose-600/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
