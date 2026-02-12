"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { trackEvent } from "@/lib/analytics/track";

export default function OracleHeader() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const linkAttemptedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !userEmail || linkAttemptedRef.current) return;
    linkAttemptedRef.current = true;

    void fetch("/api/entitlements/link", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { linked?: boolean; migrated_count?: number };
        if (data?.linked) {
          trackEvent("entitlements_linked", {
            migrated_count:
              typeof data.migrated_count === "number" ? data.migrated_count : 0,
          });
        }
        return null;
      })
      .catch(() => null);
  }, [status, userEmail]);

  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/95 text-slate-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-200">
          FutureVoyance • <span className="text-violet-300">Oracle IA</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-200/80">
          <Link href="/" className="hover:text-violet-200 transition-colors">
            Aujourd&apos;hui
          </Link>
          <Link href="/comprendre" className="hover:text-violet-200 transition-colors">
            Comprendre
          </Link>
          <Link href="/aimer" className="hover:text-violet-200 transition-colors">
            Aimer
          </Link>
          <Link href="/prevoir" className="hover:text-violet-200 transition-colors">
            Prévoir
          </Link>
          <Link href="/recevoir" className="hover:text-violet-200 transition-colors">
            Recevoir
          </Link>
          <Link href="/mon-oracle" className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-100 hover:bg-violet-500/20 transition-colors">
            Mon Oracle
          </Link>
          {userEmail ? (
            <>
              <span className="text-xs text-slate-300/90">{userEmail}</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-slate-500/40 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-slate-300/60 hover:text-white"
              >
                Se deconnecter
              </button>
            </>
          ) : (
            <Link
              href="/login?callbackUrl=/mon-oracle"
              className="rounded-full border border-slate-500/40 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-slate-300/60 hover:text-white"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
