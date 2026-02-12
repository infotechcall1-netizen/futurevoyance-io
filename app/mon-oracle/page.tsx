import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { UID_COOKIE } from "@/lib/constants";
import type { OracleResponse, PortalId } from "@/lib/oracle/schema";

export const metadata: Metadata = {
  title: "Mon Oracle • Espace personnel | FutureVoyance",
  description:
    "Retrouve ton espace Oracle personnel : ton historique de tirages et tes messages vibratoires passés.",
};
export const dynamic = "force-dynamic";

const PORTAL_LABELS: Record<PortalId | string, string> = {
  comprendre: "Comprendre",
  aimer: "Aimer",
  prevoir: "Prévoir",
  recevoir: "Recevoir",
};

const PORTAL_COLORS: Record<PortalId | string, string> = {
  comprendre: "border-l-2 border-[#7C3AED] bg-[#FBFAF7]",
  aimer: "border-l-2 border-[#DB2777] bg-[#FBFAF7]",
  prevoir: "border-l-2 border-[#2563EB] bg-[#FBFAF7]",
  recevoir: "border-l-2 border-[#059669] bg-[#FBFAF7]",
};

type HistoryItem = {
  id: string;
  timestamp: string;
  portal_id: PortalId;
  prompt: string;
  response: OracleResponse;
};

async function getHistory(userKey: string): Promise<HistoryItem[]> {
  try {
    const data = await redis.lrange(`fv:history:${userKey.toLowerCase()}`, 0, 49);
    return data.map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    }).filter(Boolean) as HistoryItem[];
  } catch (error) {
    console.error("[history_fetch_error]", error);
    return [];
  }
}

export default async function MonOraclePage() {
  const session = await getServerAuthSession();
  const cookieStore = await cookies();
  const userKey = session?.user?.email || cookieStore.get(UID_COOKIE)?.value;

  if (!userKey) {
    redirect("/login?callbackUrl=/mon-oracle");
  }

  const history = await getHistory(userKey);

  return (
    <div className="space-y-16">
      <header className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Mon Oracle personnel
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Un lieu sacré où l&apos;Oracle conserve la trace de tes tirages passés.
          Chaque message est une pierre blanche sur ton chemin.
        </p>
      </header>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">Dernières Vibrations</h2>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/40">{history.length} tirages</span>
        </div>

        {history.length === 0 ? (
          <div className="border border-dashed border-[#E5E3DD] bg-[#FBFAF7] p-16 text-center">
            <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
              Ton historique est encore vierge. <br />
              Commence par interroger l&apos;Oracle pour voir tes tirages apparaître ici.
            </p>
            <Link
              href="/comprendre"
              className="mt-8 inline-block rounded-sm bg-[#7C3AED] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9]"
            >
              Faire mon premier tirage
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col justify-between p-6 transition-all hover:shadow-sm ${PORTAL_COLORS[item.portal_id] || "border-l-2 border-[#7C3AED] bg-[#FBFAF7]"}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="rounded-sm bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/70 shadow-sm">
                      {PORTAL_LABELS[item.portal_id] || item.portal_id}
                    </span>
                    <span className="text-[10px] font-medium text-[#1A1A1A]/40">
                      {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs italic text-[#1A1A1A]/50 line-clamp-1 group-hover:text-[#1A1A1A]/60">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                    <p className="text-sm font-medium leading-snug text-[#1A1A1A]">
                      {item.response.content.essentiel}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#E5E3DD] pt-4">
                  <span className="text-[11px] text-[#1A1A1A]/50 transition group-hover:text-[#1A1A1A]/60">
                    {item.response.content.cta_label}
                  </span>
                  <Link
                    href={`/modules/${item.response.routing.module_id}`}
                    className="text-[11px] font-semibold text-[#7C3AED] transition hover:text-[#6D28D9]"
                  >
                    Revoir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 border-l-2 border-[#C9A961] bg-[#FBFAF7] px-6 py-8 opacity-70">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#C9A961] animate-pulse" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">Rituels & Pratiques (Bientôt)</h2>
        </div>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
          Bientôt, tu pourras enregistrer tes habitudes énergétiques et
          pratiques spirituelles pour que l&apos;Oracle puisse les relier à tes
          cycles.
        </p>
      </section>
    </div>
  );
}
