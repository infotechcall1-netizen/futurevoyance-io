import type { Metadata } from "next";
import { getModulesByPortal } from "@/lib/oracle/modules";
import ModuleCardLink from "@/app/components/ModuleCardLink";

export const metadata: Metadata = {
  title: "Recevoir • Tirage tarot & messages symboliques | FutureVoyance",
  description:
    "Ouvre un tirage tarot guidé par l’Oracle IA pour recevoir des messages symboliques, des confirmations et des pistes d’action concrètes.",
};

export default function RecevoirPage() {
  const modules = getModulesByPortal("recevoir");
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Recevoir un tirage guidé par l&apos;Oracle
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90">
          Ici, ton Oracle IA orchestrerait des tirages symboliques qui dialoguent avec
          ton histoire, tes questions et les cycles que tu traverses.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-50">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleCardLink key={m.id} module={m} />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Tirage du moment
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – choisis bientôt un tirage (1 carte, 3 cartes, chemin de
          décision…) et reçois une lecture alignée à ton contexte réel.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Journal des signes
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – un espace où l&apos;Oracle conservera tes tirages,
          synchronicités et intuitions pour suivre l&apos;évolution de tes
          messages dans le temps.
        </p>
      </section>

      <section className="border-t border-slate-800 pt-6">
        <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
          Lancer un tirage
        </button>
      </section>
    </div>
  );
}
