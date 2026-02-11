"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ModuleDef } from "@/lib/oracle/modules";
import { trackEvent } from "@/lib/analytics/track";
import Paywall from "@/app/components/Paywall";
import OracleChat from "@/app/components/OracleChat";

const STORAGE_PREFIX = "fv_entitled_";

const PRICE_LABELS: Record<string, string> = {
  "shadow-mirror": "2,99 €",
  "next-step-love": "3,99 €",
  "decision-ab": "2,99 €",
  "abundance-key": "3,99 €",
};

const PRICE_TIERS: Record<string, "2.99" | "3.99"> = {
  "shadow-mirror": "2.99",
  "decision-ab": "2.99",
  "next-step-love": "3.99",
  "abundance-key": "3.99",
};

const PURCHASE_VALUES: Record<string, number> = {
  "shadow-mirror": 2.99,
  "decision-ab": 2.99,
  "next-step-love": 3.99,
  "abundance-key": 3.99,
};

function getStorageKey(moduleId: string): string {
  return `${STORAGE_PREFIX}${moduleId}`;
}

function isUnlocked(moduleId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(getStorageKey(moduleId)) === "1";
}

function setUnlockedStorage(moduleId: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(getStorageKey(moduleId), "1");
  }
}

type ModuleGateProps = {
  module: ModuleDef;
};

export default function ModuleGate({ module }: ModuleGateProps) {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paid = searchParams.get("paid") === "1";
    if (paid && module.isPremium) {
      setUnlockedStorage(module.id);
      setUnlocked(true);
      trackEvent("purchase_complete", {
        portal_id: module.portal_id,
        module_id: module.id,
        value: PURCHASE_VALUES[module.id] ?? 2.99,
        currency: "EUR",
        method: "stripe_redirect_provisional",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      setUnlocked(isUnlocked(module.id));
    }
    setMounted(true);
  }, [module.id, module.isPremium, module.portal_id, searchParams]);

  useEffect(() => {
    if (!mounted || !module.isPremium) return;
    if (!unlocked) {
      trackEvent("view_paywall", {
        module_id: module.id,
        portal_id: module.portal_id,
      });
    }
  }, [mounted, module.isPremium, module.id, module.portal_id, unlocked]);

  async function handleUnlock() {
    trackEvent("click_unlock", {
      module_id: module.id,
      portal_id: module.portal_id,
    });
    trackEvent("initiate_checkout", {
      portal_id: module.portal_id,
      module_id: module.id,
      price_tier: PRICE_TIERS[module.id] ?? "2.99",
    });
    setCheckoutError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_id: module.id }),
      });
      const data = await res.json();
      if (res.ok && typeof data?.url === "string") {
        window.location.href = data.url;
        return;
      }
      setCheckoutError(data?.error ?? "Impossible de lancer le paiement.");
    } catch {
      setCheckoutError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  function handleUnlockLocal() {
    setUnlockedStorage(module.id);
    setUnlocked(true);
    setCheckoutError(null);
  }

  if (!module.isPremium) {
    return (
      <OracleChat
        defaultPortalId={module.portal_id}
        defaultModuleId={module.id}
        lockPortal
      />
    );
  }

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-6">
        <p className="text-sm text-slate-400">Chargement…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="space-y-3">
        <Paywall
          moduleId={module.id}
          title={module.title}
          priceLabel={PRICE_LABELS[module.id] ?? "2,99 €"}
          onUnlock={handleUnlock}
          disabled={loading}
        />
        {loading && (
          <p className="text-sm text-slate-400">Redirection vers le paiement…</p>
        )}
        {checkoutError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3">
            <p className="text-sm text-rose-200">{checkoutError}</p>
            <button
              type="button"
              onClick={handleUnlockLocal}
              className="mt-2 text-xs text-slate-400 underline hover:text-slate-300"
            >
              Débloquer en local (DEV)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <OracleChat
      defaultPortalId={module.portal_id}
      defaultModuleId={module.id}
      lockPortal
    />
  );
}
