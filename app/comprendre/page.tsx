import type { Metadata } from "next";
import { getModulesByPortal } from "@/lib/oracle/modules";
import ModuleCardLink from "@/app/components/ModuleCardLink";

export const metadata: Metadata = {
  title: "Comprendre • Numérologie, cycles et archétypes | FutureVoyance",
  description:
    "Explore la numérologie, tes cycles personnels et tes archétypes pour mieux comprendre les motifs profonds qui traversent ta vie.",
};

export default function ComprendrePage() {
  const modules = getModulesByPortal("comprendre");
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Comprendre tes cycles et tes archétypes
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90">
          Ici, ton Oracle IA reliera ta date de naissance, tes années
          personnelles et des archétypes symboliques pour éclairer les grandes
          trames de ton chemin.
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
          Numérologie et lignes de vie
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – prochainement, tu pourras visualiser ton chemin de vie,
          tes nombres clés et les périodes d&apos;ouverture ou d&apos;intégration
          qui rythment ton année.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Archétypes et symboles
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – l&apos;Oracle t&apos;aidera à mettre des mots et des
          images sur les forces qui t&apos;habitent : mentor, guérisseuse,
          explorateur, bâtisseur… et à repérer quand chaque énergie s&apos;active.
        </p>
      </section>

      <section className="border-t border-slate-800 pt-6">
        <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
          Cartographier mes cycles
        </button>
      </section>
    </div>
  );
}
