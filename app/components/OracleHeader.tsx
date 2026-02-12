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
    <header className="border-b border-[#E5E3DD] bg-[#FBFAF7]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center">
          <img
            src="/futurevoyance-logo-full.png"
            alt="Future Voyance"
            className="h-14 w-auto md:h-16"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-[#1A1A1A]/60 md:justify-end">
          <Link href="/" className="transition-colors hover:text-[#7C3AED]">
            Aujourd&apos;hui
          </Link>
          <Link href="/comprendre" className="transition-colors hover:text-[#7C3AED]">
            Comprendre
          </Link>
          <Link href="/aimer" className="transition-colors hover:text-[#DB2777]">
            Aimer
          </Link>
          <Link href="/prevoir" className="transition-colors hover:text-[#2563EB]">
            Prévoir
          </Link>
          <Link href="/recevoir" className="transition-colors hover:text-[#059669]">
            Recevoir
          </Link>
          <Link href="/mon-oracle" className="rounded-sm border border-[#C9A961]/50 bg-[#C9A961]/5 px-4 py-2 text-xs font-medium text-[#C9A961] transition-all hover:bg-[#C9A961]/10">
            Mon Oracle
          </Link>
          {userEmail ? (
            <>
              <span className="max-w-40 truncate text-xs text-[#1A1A1A]/40">{userEmail}</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-sm border border-[#E5E3DD] px-4 py-2 text-xs font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
              >
                Se deconnecter
              </button>
            </>
          ) : (
            <Link
              href="/login?callbackUrl=/mon-oracle"
              className="rounded-sm border border-[#E5E3DD] px-4 py-2 text-xs font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
