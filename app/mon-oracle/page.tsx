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
  comprendre: "border-indigo-500/30 bg-indigo-500/5 text-indigo-200",
  aimer: "border-rose-500/30 bg-rose-500/5 text-rose-200",
  prevoir: "border-amber-500/30 bg-amber-500/5 text-amber-200",
  recevoir: "border-teal-500/30 bg-teal-500/5 text-teal-200",
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
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 font-serif">
          Mon Oracle personnel
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90 leading-relaxed">
          Un lieu sacré où l&apos;Oracle conserve la trace de tes tirages passés.
          Chaque message est une pierre blanche sur ton chemin.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-medium text-slate-50 italic">Dernières Vibrations</h2>
          <span className="text-xs text-slate-500 uppercase tracking-widest">{history.length} tirages</span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center">
            <p className="text-sm text-slate-400">
              Ton historique est encore vierge. <br />
              Commence par interroger l&apos;Oracle pour voir tes tirages apparaître ici.
            </p>
            <Link
              href="/comprendre"
              className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-2 text-sm font-medium text-slate-50 transition hover:bg-violet-500"
            >
              Faire mon premier tirage
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:bg-slate-900/40 ${PORTAL_COLORS[item.portal_id] || "border-slate-700/70 bg-slate-950/70"}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-300 shadow-sm">
                      {PORTAL_LABELS[item.portal_id] || item.portal_id}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs italic text-slate-500 line-clamp-1 group-hover:text-slate-400">
                      &ldquo;{item.prompt}&rdquo;
                    </p>
                    <p className="text-sm font-medium text-slate-200 leading-snug">
                      {item.response.content.essentiel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-700/30">
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition">
                    {item.response.content.cta_label}
                  </span>
                  <Link
                    href={`/modules/${item.response.routing.module_id}`}
                    className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition"
                  >
                    Revoir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-6 opacity-60">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-violet-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-50 uppercase tracking-widest">Rituels & Pratiques (Bientôt)</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Bientôt, tu pourras enregistrer tes habitudes énergétiques et
          pratiques spirituelles pour que l&apos;Oracle puisse les relier à tes
          cycles.
        </p>
      </section>
    </div>
  );
}
