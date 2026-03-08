import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { UID_COOKIE } from "@/lib/constants";
import { oracleOfDay, oraclePersonal } from "@/app/lib/oracle";
import prisma from "@/lib/prisma";
import { generateNatalChart } from "@/lib/astrology/engine";
import AstrologySummaryCard from "@/app/components/astrology/AstrologySummaryCard";
import type { OracleResponse, PortalId } from "@/lib/oracle/schema";
import { canAccessPremium } from "@/lib/subscription";
import VibrationDayCard from "@/app/components/VibrationDayCard";
import DailyGuidance from "@/app/components/DailyGuidance";
import SubscriptionGate from "@/app/components/SubscriptionGate";
import MonthCalendar from "@/app/components/MonthCalendar";
import RetentionBar from "@/app/components/RetentionBar";

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
    const data = await redis.lrange(`fv:history:${userKey.toLowerCase()}`, 0, 4);
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

export default async function MonEspacePage() {
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const userKey = session?.user?.email || cookieStore.get(UID_COOKIE)?.value;

  if (!userKey) {
    redirect("/login?callbackUrl=/mon-espace");
  }

  const today = new Date();
  const history = await getHistory(userKey);

  // Fetch user data for name + birth data
  let displayName: string | null = null;
  let chart = null;
  let dayOracle = oracleOfDay(today);
  let isPersonal = false;
  let isPremium = false;

  if (session?.user?.email) {
    const [user, premium] = await Promise.all([
      prisma.user.findUnique({
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
      }),
      canAccessPremium(session.user.email),
    ]);

    isPremium = premium;
    displayName = user?.firstName || user?.name || null;

    const hasBirthData =
      !!user?.birthDate && user.birthLat != null && user.birthLon != null;

    if (user?.birthDate) {
      dayOracle = oraclePersonal(today, user.birthDate.toISOString());
      isPersonal = true;
    }

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

  const dayMessage = isPersonal ? dayOracle.personalMessage : dayOracle.dailyMessage;
  const dayRitual = isPersonal ? dayOracle.personalRitual : dayOracle.dailyRitual;

  return (
    <div className="space-y-16">
      {/* 1 — Header */}
      <header className="space-y-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          {displayName ? `Bonjour, ${displayName}` : "Mon Espace"}
        </h1>
      </header>

      {/* 1b — Vibration du jour */}
      <VibrationDayCard
        vibration={dayOracle.vibration}
        title={dayOracle.title}
        keyword={dayOracle.keyword}
        message={dayMessage}
        ritual={dayRitual}
        isPremium={isPremium}
      />

      {/* 2 — Guidance quotidienne (premium) */}
      {displayName && (
        <SubscriptionGate>
          <DailyGuidance
            firstName={displayName}
            date={today}
            vibration={dayOracle}
            sunSign={chart?.sunSign}
            risingSign={chart?.risingSign}
          />
        </SubscriptionGate>
      )}

      {/* 3 — Quick actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link
          href="/mon-espace/oracle"
          className="group flex items-center gap-3 border border-[#E5E3DD] bg-[#FBFAF7] p-5 transition-all hover:border-[#7C3AED]/40 hover:shadow-sm"
        >
          <span className="text-2xl text-[#7C3AED]">◎</span>
          <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors">
            Poser une question à l&apos;Oracle&nbsp;→
          </span>
        </Link>
        <Link
          href="/mon-espace/compatibilite"
          className="group flex items-center gap-3 border border-[#E5E3DD] bg-[#FBFAF7] p-5 transition-all hover:border-[#DB2777]/40 hover:shadow-sm"
        >
          <span className="text-2xl text-[#DB2777]">♡</span>
          <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#DB2777] transition-colors">
            Ma compatibilité&nbsp;→
          </span>
        </Link>
      </section>

      {/* 4 — Signature astrale */}
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

          {/* Navigation légère */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs font-medium text-[#1A1A1A]/50">
            <Link href="/mon-espace/numerologie" className="underline underline-offset-2 transition hover:text-[#7C3AED]">
              Voir ma numérologie
            </Link>
            <span className="text-[#E5E3DD]">·</span>
            <Link href="/mon-espace/astrologie" className="underline underline-offset-2 transition hover:text-[#C9A961]">
              Mon thème complet
            </Link>
            <span className="text-[#E5E3DD]">·</span>
            <Link href="/mon-espace/historique" className="underline underline-offset-2 transition hover:text-[#059669]">
              Mon historique
            </Link>
          </div>
        </section>
      )}

      {/* 5 — Calendrier avec streak */}
      <section>
        <MonthCalendar />
      </section>

      {/* 6 — Dernières vibrations */}
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

      {/* 7 — Rituels & Pratiques (Bientôt) */}
      <RetentionBar />
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
