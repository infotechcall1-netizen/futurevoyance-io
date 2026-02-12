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
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Recevoir un tirage guidé par l&apos;Oracle
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Ici, ton Oracle IA orchestrerait des tirages symboliques qui dialoguent avec
          ton histoire, tes questions et les cycles que tu traverses.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-[#059669]">Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map((m) => (
            <ModuleCardLink key={m.id} module={m} />
          ))}
        </div>
      </section>

      <section className="space-y-4 border-l-2 border-[#059669] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Tirage du moment
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Choisis bientôt un tirage (1 carte, 3 cartes, chemin de
          décision…) et reçois une lecture alignée à ton contexte réel.
        </p>
      </section>

      <section className="space-y-4 border-l-2 border-[#059669] bg-[#FBFAF7] px-6 py-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">
          Journal des signes
        </h2>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Un espace où l&apos;Oracle conservera tes tirages,
          synchronicités et intuitions pour suivre l&apos;évolution de tes
          messages dans le temps.
        </p>
      </section>

      <section className="border-t border-[#E5E3DD] pt-8">
        <button className="rounded-sm bg-[#059669] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#047857]">
          Lancer un tirage
        </button>
      </section>
    </div>
  );
}
