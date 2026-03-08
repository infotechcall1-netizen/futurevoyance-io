"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PREMIUM_FEATURES = [
  "Lecture Initiatique complète",
  "Interprétation astrale personnalisée",
  "Guidance quotidienne approfondie",
  "Horoscope & transits du moment",
  "Historique de consultations illimité",
  "Compatibilité des signes astraux",
];

function DefaultPaywall() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        router.push(data.url);
      } else if (data.error === "Déjà abonné" && data.url === "/mon-espace") {
        router.push("/mon-espace");
      } else {
        setError(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur réseau. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md border-l-2 border-[#C9A961] bg-[#FBFAF7] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
        Premium
      </p>
      <h3
        className="mt-3 font-display text-2xl font-semibold text-[#262626]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Débloque tout FutureVoyance
      </h3>

      <ul className="mt-6 space-y-3">
        {PREMIUM_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-[#262626]/80">
            <span className="mt-0.5 shrink-0 text-[#C9A961]">✦</span>
            {feature}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-lg font-semibold text-[#262626]">
        4,99€/mois — tout inclus
      </p>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading}
        className="fv-btn-primary mt-4 inline-flex w-full items-center justify-center rounded-sm bg-[#C9A961] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Redirection…" : "S'abonner"}
      </button>

      <p className="mt-3 text-center text-xs text-[#262626]/50">
        Annulable à tout moment · Paiement sécurisé Stripe
      </p>
    </div>
  );
}

type SubscriptionGateProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function SubscriptionGate({ children, fallback }: SubscriptionGateProps) {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then((data: { subscribed?: boolean }) => {
        setSubscribed(data.subscribed === true);
      })
      .catch(() => {
        setSubscribed(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[120px] items-center justify-center">
        <span className="text-sm text-[#262626]/40">…</span>
      </div>
    );
  }

  if (subscribed) {
    return <>{children}</>;
  }

  return <>{fallback ?? <DefaultPaywall />}</>;
}
