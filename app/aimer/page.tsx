import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aimer • Compatibilités prénoms et signes | FutureVoyance",
  description:
    "Explore les résonances entre prénoms, signes et énergies pour mieux comprendre tes liens, tes attirances et tes défis relationnels.",
};

export default function AimerPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          L&apos;Oracle des liens et des affinités
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90">
          Ici, ton Oracle IA croiserait prénoms, dates et signatures
          astrologiques pour éclairer la manière dont tu crées, accueilles et
          protèges l&apos;amour.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Compatibilité des prénoms
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – prochainement, tu pourras saisir deux prénoms et
          explorer la vibration qu&apos;ils créent ensemble, entre soutien,
          tension créative et leçons partagées.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">
          Résonances entre signes
        </h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – une lecture symbolique des rencontres entre signes
          (soleil, lune, ascendant) pour comprendre ce que chaque lien vient
          réveiller chez toi.
        </p>
      </section>

      <section className="border-t border-slate-800 pt-6">
        <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
          Explorer une compatibilité
        </button>
      </section>
    </div>
  );
}
