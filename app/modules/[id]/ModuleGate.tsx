"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ModuleDef } from "@/lib/oracle/modules";
import { trackEvent } from "@/lib/analytics/track";
import Paywall from "@/app/components/Paywall";
import OracleChat from "@/app/components/OracleChat";
import { PRICING_CATALOG, DEFAULT_PRICE_LABEL, DEFAULT_PRICE_VALUE, DEFAULT_PRICE_TIER } from "@/lib/pricing/catalog";

const STORAGE_PREFIX = "fv_entitled_";
const VERIFY_BACKOFF_MS = [0, 1200, 2500, 8000, 12000];



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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type ModuleGateProps = {
  module: ModuleDef;
};

export default function ModuleGate({ module }: ModuleGateProps) {
  const isDev = process.env.NODE_ENV === "development";
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const paywallTrackedRef = useRef(false);

  async function fetchEntitlement(moduleId: string): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/entitlements?module_id=${encodeURIComponent(moduleId)}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );
      if (!res.ok) return false;
      const data = (await res.json()) as { entitled?: boolean };
      return data.entitled === true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function syncEntitlementFromServer() {
      const paid = searchParams.get("paid") === "1";

      // UX: restore optimistic unlock quickly, then confirm server-side.
      if (isUnlocked(module.id)) {
        setUnlocked(true);
      } else {
        setUnlocked(false);
      }

      if (!module.isPremium) {
        setMounted(true);
        return;
      }

      const waitSchedule = paid ? VERIFY_BACKOFF_MS : [0];
      let entitled = false;

      for (const ms of waitSchedule) {
        if (ms > 0) await delay(ms);
        if (cancelled) return;
        entitled = await fetchEntitlement(module.id);
        if (entitled) break;
      }
      if (cancelled) return;

      if (entitled) {
        setUnlockedStorage(module.id);
        setUnlocked(true);
        if (paid) {
          trackEvent("purchase_complete", {
            portal_id: module.portal_id,
            module_id: module.id,
            value: PRICING_CATALOG[module.id]?.value ?? DEFAULT_PRICE_VALUE,
            currency: "EUR",
            method: "stripe_redirect_confirmed",
          });
          trackEvent("entitlement_granted", {
            portal_id: module.portal_id,
            module_id: module.id,
            is_premium: true,
            method: "server_check",
          });
          window.history.replaceState({}, "", window.location.pathname);
        }
      } else if (paid) {
        setCheckoutError("Paiement non confirmé, contacte support.");
      }

      setMounted(true);
    }

    void syncEntitlementFromServer();

    return () => {
      cancelled = true;
    };
  }, [module.id, module.isPremium, module.portal_id, searchParams]);

  useEffect(() => {
    paywallTrackedRef.current = false;
  }, [module.id]);

  useEffect(() => {
    if (!mounted || !module.isPremium) return;
    if (unlocked || paywallTrackedRef.current) return;
    trackEvent("view_paywall", {
      module_id: module.id,
      portal_id: module.portal_id,
    });
    paywallTrackedRef.current = true;
  }, [mounted, module.isPremium, module.id, module.portal_id, unlocked]);

  async function handleUnlock() {
    trackEvent("click_unlock", {
      module_id: module.id,
      portal_id: module.portal_id,
    });
    trackEvent("initiate_checkout", {
      portal_id: module.portal_id,
      module_id: module.id,
      price_tier: PRICING_CATALOG[module.id]?.tier ?? DEFAULT_PRICE_TIER,
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
          priceLabel={PRICING_CATALOG[module.id]?.label ?? DEFAULT_PRICE_LABEL}
          onUnlock={handleUnlock}
          disabled={loading}
        />
        {loading && (
          <p className="text-sm text-slate-400">Redirection vers le paiement…</p>
        )}
        {checkoutError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3">
            <p className="text-sm text-rose-200">{checkoutError}</p>
            {isDev && (
              <button
                type="button"
                onClick={handleUnlockLocal}
                className="mt-2 text-xs text-slate-400 underline hover:text-slate-300"
              >
                Débloquer en local (DEV)
              </button>
            )}
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
