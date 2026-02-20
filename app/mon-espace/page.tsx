import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { UID_COOKIE } from "@/lib/constants";
import { oracleOfDay } from "@/app/lib/oracle";
import prisma from "@/lib/prisma";
import { generateNatalChart } from "@/lib/astrology/engine";
import AstrologySummaryCard from "@/app/components/astrology/AstrologySummaryCard";
import type { OracleResponse, PortalId } from "@/lib/oracle/schema";

export const metadata: Metadata = {
  title: "Mon Espace | FutureVoyance",
  description:
    "Ton espace personnel : numérologie, thème astral, compatibilité et historique de tirages.",
};
export const dynamic = "force-dynamic";

const PORTAL_LABELS: Record<PortalId | string, string> = {
  comprendre: "Comprendre",
  aimer: "Aimer",
  prevoir: "Prévoir",
  recevoir: "Recevoir",
};

const PORTAL_COLORS: Record<PortalId | string, string> = {
  comprendre: "border-l-2 border-[#7C3AED]",
  aimer: "border-l-2 border-[#DB2777]",
  prevoir: "border-l-2 border-[#2563EB]",
  recevoir: "border-l-2 border-[#059669]",
};

type HistoryItem = {
  id: string;
  timestamp: string;
  portal_id: PortalId;
  prompt: string;
  response: OracleResponse;
};

async function getHistory(userKey: string): Promise<HistoryItem[]> {
  if (!redis) return [];
  try {
    const data = await redis.lrange(`fv:history:${userKey.toLowerCase()}`, 0, 2);
    return data
      .map((item) => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as HistoryItem[];
  } catch {
    return [];
  }
}

const HUB_LINKS = [
  {
    href: "/mon-espace/numerologie",
    icon: "∞",
    label: "Numérologie",
    desc: "Chemin de vie & vibration du prénom",
    color: "#7C3AED",
  },
  {
    href: "/mon-espace/astrologie",
    icon: "☉",
    label: "Thème Astral",
    desc: "Carte du ciel & ascendant",
    color: "#C9A961",
  },
  {
    href: "/mon-espace/compatibilite",
    icon: "♡",
    label: "Compatibilité",
    desc: "Prénoms & signes astraux",
    color: "#DB2777",
  },
  {
    href: "/mon-espace/historique",
    icon: "◎",
    label: "Historique",
    desc: "Tes tirages passés",
    color: "#059669",
  },
];

export default async function MonEspacePage() {
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const userKey = session?.user?.email || cookieStore.get(UID_COOKIE)?.value;

  if (!userKey) {
    redirect("/login?callbackUrl=/mon-espace");
  }

  const dayOracle = oracleOfDay(new Date());
  const history = await getHistory(userKey);

  // Fetch user data for name + birth data
  let displayName: string | null = null;
  let chart = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        firstName: true,
        name: true,
        birthDate: true,
        birthLat: true,
        birthLon: true,
        birthCity: true,
        birthTimezone: true,
      },
    });

    displayName = user?.firstName || user?.name || null;

    const hasBirthData =
      !!user?.birthDate && user.birthLat != null && user.birthLon != null;

    if (hasBirthData && user.birthDate && user.birthLat != null && user.birthLon != null) {
      chart = generateNatalChart(
        user.firstName ?? user.name ?? "",
        user.birthDate,
        user.birthLat,
        user.birthLon,
        user.birthCity ?? "",
        user.birthTimezone ?? "UTC"
      );
    }
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          {displayName ? `Bonjour, ${displayName}` : "Mon Espace"}
        </h1>
        <div className="flex items-center gap-3 text-sm text-[#1A1A1A]/50">
          <span>Vibration du jour</span>
          <span className="font-semibold text-[#C9A961]">{dayOracle.vibration} · {dayOracle.keyword}</span>
        </div>
      </header>

      {/* Quick links grid */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HUB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-3 border border-[#E5E3DD] bg-[#FBFAF7] p-5 transition-all hover:shadow-sm hover:border-[#1A1A1A]/20"
            >
              <span className="text-2xl" style={{ color: link.color }}>{link.icon}</span>
              <div>
                <p className="font-medium text-[#1A1A1A] group-hover:text-[#1A1A1A]">{link.label}</p>
                <p className="mt-0.5 text-xs text-[#1A1A1A]/50">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature astrale */}
      {chart && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
              Signature Astrale
            </h2>
            <Link
              href="/mon-espace/astrologie"
              className="text-xs font-semibold text-[#C9A961] underline underline-offset-4 hover:opacity-80"
            >
              Voir le thème complet →
            </Link>
          </div>
          <AstrologySummaryCard chart={chart} />
        </section>
      )}

      {/* Historique récent */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
            Dernières Vibrations
          </h2>
          <Link
            href="/mon-espace/historique"
            className="text-xs font-semibold text-[#7C3AED] underline underline-offset-4 hover:text-[#6D28D9]"
          >
            Voir tout →
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="border border-dashed border-[#E5E3DD] bg-[#FBFAF7] p-10 text-center">
            <p className="text-sm text-[#1A1A1A]/60">
              Ton historique est encore vierge.{" "}
              <Link href="/comprendre" className="underline underline-offset-2 text-[#7C3AED]">
                Fais ton premier tirage →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {history.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 bg-[#FBFAF7] p-5 ${PORTAL_COLORS[item.portal_id] || "border-l-2 border-[#7C3AED]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-sm bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/70 shadow-sm">
                    {PORTAL_LABELS[item.portal_id] || item.portal_id}
                  </span>
                  <span className="text-[10px] text-[#1A1A1A]/40">
                    {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-[#1A1A1A]">
                  {item.response.content.essentiel}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rituels & Pratiques (Bientôt) */}
      <section className="space-y-4 border-l-2 border-[#C9A961] bg-[#FBFAF7] px-6 py-8 opacity-70">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#C9A961] animate-pulse" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
            Rituels & Pratiques (Bientôt)
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
          Bientôt, tu pourras enregistrer tes habitudes énergétiques et pratiques spirituelles pour
          que l&apos;Oracle puisse les relier à tes cycles.
        </p>
      </section>
    </div>
  );
}
