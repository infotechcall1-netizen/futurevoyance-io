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
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Horoscope du jour, à ta fréquence
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Ici, ton Oracle IA mêlerait données célestes et mémoire de ton profil
          pour t&apos;offrir un éclairage précis sur l&apos;énergie de ta
          journée.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-[#2563EB]">Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleCardLink key={m.id} module={m} />
          ))}
        </div>
      </section>

      <section className="space-y-4 border-l-2 border-[#2563EB] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Climat général du jour
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Un résumé clair de l&apos;ambiance pour toi aujourd&apos;hui :
          opportunités à saisir, zones de vigilance et espaces de repos
          nécessaires.
        </p>
      </section>

      <section className="space-y-4 border-l-2 border-[#2563EB] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Focus amour, pro, alignement
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Trois axes pour suivre comment l&apos;énergie du jour
          se manifeste dans tes relations, tes projets et ton espace intérieur.
        </p>
      </section>

      <section className="border-t border-[#E5E3DD] pt-8">
        <button className="rounded-sm bg-[#2563EB] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D4ED8]">
          Recevoir mon horoscope
        </button>
      </section>
    </div>
  );
}
