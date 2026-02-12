"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationLinks = [
  { href: "/", label: "Aujourd'hui", color: "#7C3AED" },
  { href: "/comprendre", label: "Comprendre", color: "#7C3AED" },
  { href: "/aimer", label: "Aimer", color: "#DB2777" },
  { href: "/prevoir", label: "Prévoir", color: "#2563EB" },
  { href: "/recevoir", label: "Recevoir", color: "#059669" },
];

export default function SiteHeader() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const linkAttemptedRef = useRef(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E3DD] bg-[#FBFAF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FBFAF7]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <img
            src="/futurevoyance-logo-light.svg"
            alt="Future Voyance"
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative min-h-[44px] flex items-center text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#7C3AED]"
                    : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                }`}
                style={isActive ? { color: link.color } : {}}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-5 left-0 right-0 h-0.5"
                    style={{ backgroundColor: link.color }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/mon-oracle"
            className="min-h-[44px] flex items-center rounded-sm border border-[#7C3AED] bg-[#7C3AED] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#6D28D9]"
          >
            Mon Oracle
          </Link>
          {userEmail ? (
            <>
              <span className="max-w-32 truncate text-xs text-[#1A1A1A]/50">
                {userEmail}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="min-h-[44px] flex items-center rounded-sm border border-[#E5E3DD] px-4 py-2.5 text-sm font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              href="/login?callbackUrl=/mon-oracle"
              className="min-h-[44px] flex items-center rounded-sm border border-[#E5E3DD] px-4 py-2.5 text-sm font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
            >
              Se connecter
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-[#E5E3DD] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-[#1A1A1A]" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">
                <img
                  src="/futurevoyance-logo-light.svg"
                  alt="Future Voyance"
                  className="h-10 w-auto"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-1">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-[48px] items-center rounded-sm px-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-[#7C3AED]/5 text-[#7C3AED]"
                          : "text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
                      }`}
                      style={isActive ? { color: link.color, backgroundColor: `${link.color}10` } : {}}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 border-t border-[#E5E3DD] pt-6">
                <Link
                  href="/mon-oracle"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-sm border border-[#7C3AED] bg-[#7C3AED] px-5 py-3 text-base font-medium text-white transition-all hover:bg-[#6D28D9]"
                >
                  Mon Oracle
                </Link>
                {userEmail ? (
                  <>
                    <div className="px-3 text-xs text-[#1A1A1A]/50">{userEmail}</div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex min-h-[48px] items-center justify-center rounded-sm border border-[#E5E3DD] px-5 py-3 text-base font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login?callbackUrl=/mon-oracle"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-center rounded-sm border border-[#E5E3DD] px-5 py-3 text-base font-medium text-[#1A1A1A]/70 transition-all hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
