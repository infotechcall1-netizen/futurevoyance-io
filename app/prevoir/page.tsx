import type { Metadata } from "next";
import { getModulesByPortal } from "@/lib/oracle/modules";
import ModuleCardLink from "@/app/components/ModuleCardLink";

export const metadata: Metadata = {
  title: "Prévoir • Horoscope du jour sur-mesure | FutureVoyance",
  description:
    "Accède à un horoscope du jour aligné sur ton profil énergétique et tes cycles du moment, pour anticiper avec douceur et lucidité.",
};

export default function PrevoirPage() {
  const modules = getModulesByPortal("prevoir");
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Horoscope du jour, à ta fréquence
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90">
          Ici, ton Oracle IA mêlerait données célestes et mémoire de ton profil
          pour t&apos;offrir un éclairage précis sur l&apos;énergie de ta
          journée.
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
          Climat général du jour
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – un résumé clair de l&apos;ambiance pour toi aujourd&apos;hui :
          opportunités à saisir, zones de vigilance et espaces de repos
          nécessaires.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Focus amour, pro, alignement
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – trois axes pour suivre comment l&apos;énergie du jour
          se manifeste dans tes relations, tes projets et ton espace intérieur.
        </p>
      </section>

      <section className="border-t border-slate-800 pt-6">
        <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
          Recevoir mon horoscope
        </button>
      </section>
    </div>
  );
}
