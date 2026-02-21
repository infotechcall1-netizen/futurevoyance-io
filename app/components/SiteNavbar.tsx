"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { trackEvent } from "@/lib/analytics/track";

const NAV_LINKS = [
  { href: "/", label: "Aujourd\u2019hui" },
  { href: "/comprendre", label: "Comprendre" },
  { href: "/aimer", label: "Aimer" },
  { href: "/prevoir", label: "Prévoir" },
  { href: "/recevoir", label: "Recevoir" },
];

export default function SiteNavbar() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const linkAttemptedRef = useRef(false);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !userEmail || linkAttemptedRef.current) return;
    linkAttemptedRef.current = true;
    void fetch("/api/entitlements/link", { method: "POST", credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { linked?: boolean; migrated_count?: number };
        if (data?.linked) {
          trackEvent("entitlements_linked", {
            migrated_count: typeof data.migrated_count === "number" ? data.migrated_count : 0,
          });
        }
        return null;
      })
      .catch(() => null);
  }, [status, userEmail]);

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <div className="flex w-full flex-col items-center pt-4 pb-2 px-4">
      <nav className="w-full max-w-6xl px-2 sm:px-6">
        <div className="bg-[#1A1A1A] rounded-pill p-2 flex items-center justify-between nav-shadow border border-white/5">
          {/* Left: globe + brand */}
          <div className="flex items-center">
            <Link href="/" className="w-11 h-11 bg-white rounded-full flex items-center justify-center ml-1 shrink-0 overflow-hidden">
              <img src="/logo-fv.png" alt="FutureVoyance" className="w-[30px] h-[30px] object-contain" />
            </Link>
            <Link href="/" className="ml-4 font-display text-lg font-bold text-white tracking-tight hidden lg:block">
              <span className="text-primary mr-0.5">•</span>FutureVoyance
            </Link>
          </div>

          {/* Center: desktop links */}
          <ul className="hidden md:flex items-center space-x-8 lg:space-x-12 px-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: user pill or login */}
          <div className="flex items-center gap-2 pr-1">
            {userEmail ? (
              <div className="bg-white rounded-pill px-5 py-2.5 flex items-center group cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-[#1A1A1A] text-sm font-medium mr-3 max-w-[180px] truncate">{userEmail}</span>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-3 flex items-center text-[#1A1A1A] hover:text-primary transition-colors"
                  title="Déconnexion"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login?callbackUrl=/mon-oracle"
                className="bg-white rounded-pill px-5 py-2.5 flex items-center hover:bg-gray-100 transition-colors"
              >
                <span className="text-[#1A1A1A] text-sm font-medium">Se connecter</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden ml-1 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-white text-xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-[#1A1A1A] rounded-3xl p-4 border border-white/5 nav-shadow">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
