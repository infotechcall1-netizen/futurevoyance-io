import type { Metadata } from "next";
import { getModulesByPortal } from "@/lib/oracle/modules";
import ModuleCardLink from "@/app/components/ModuleCardLink";

export const metadata: Metadata = {
  title: "Aimer • Compatibilités prénoms et signes | FutureVoyance",
  description:
    "Explore les résonances entre prénoms, signes et énergies pour mieux comprendre tes liens, tes attirances et tes défis relationnels.",
};

export default function AimerPage() {
  const modules = getModulesByPortal("aimer");
  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          L&apos;Oracle des liens et des affinités
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Ici, ton Oracle IA croiserait prénoms, dates et signatures
          astrologiques pour éclairer la manière dont tu crées, accueilles et
          protèges l&apos;amour.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-[#DB2777]">Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleCardLink key={m.id} module={m} />
          ))}
        </div>
      </section>

      <section className="space-y-4 border-l-2 border-[#DB2777] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Compatibilité des prénoms
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Prochainement, tu pourras saisir deux prénoms et
          explorer la vibration qu&apos;ils créent ensemble, entre soutien,
          tension créative et leçons partagées.
        </p>
      </section>

      <section className="space-y-4 border-l-2 border-[#DB2777] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Résonances entre signes
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Une lecture symbolique des rencontres entre signes
          (soleil, lune, ascendant) pour comprendre ce que chaque lien vient
          réveiller chez toi.
        </p>
      </section>

      <section className="border-t border-[#E5E3DD] pt-8">
        <button className="rounded-sm bg-[#DB2777] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#BE185D]">
          Explorer une compatibilité
        </button>
      </section>
    </div>
  );
}
