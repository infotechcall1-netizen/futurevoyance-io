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
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Comprendre tes cycles et tes archétypes
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Ici, ton Oracle IA reliera ta date de naissance, tes années
          personnelles et des archétypes symboliques pour éclairer les grandes
          trames de ton chemin.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-[#7C3AED]">Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleCardLink key={m.id} module={m} />
          ))}
        </div>
      </section>

      <section className="space-y-4 border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Numérologie et lignes de vie
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Prochainement, tu pourras visualiser ton chemin de vie,
          tes nombres clés et les périodes d&apos;ouverture ou d&apos;intégration
          qui rythment ton année.
        </p>
      </section>

      <section className="space-y-4 border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Archétypes et symboles
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          L&apos;Oracle t&apos;aidera à mettre des mots et des
          images sur les forces qui t&apos;habitent : mentor, guérisseuse,
          explorateur, bâtisseur… et à repérer quand chaque énergie s&apos;active.
        </p>
      </section>

      <section className="border-t border-[#E5E3DD] pt-8">
        <button className="rounded-sm bg-[#7C3AED] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9]">
          Cartographier mes cycles
        </button>
      </section>
    </div>
  );
}
