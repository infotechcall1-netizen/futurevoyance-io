import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Oracle • Espace personnel | FutureVoyance",
  description:
    "Retrouve ton espace Oracle personnel : historiques, favoris et rituels pour suivre ton chemin dans le temps.",
};

export default function MonOraclePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Mon Oracle personnel
        </h1>
        <p className="max-w-2xl text-sm text-slate-300/90">
          Bientôt, ton espace relié : un lieu où l&apos;Oracle se souvient de tes
          tirages, de tes décisions, de tes rituels et des dates qui comptent pour toi.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">Historique & favoris</h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – retrouve ici tes derniers tirages, les messages que tu as
          marqués comme importants et les décisions clés que tu souhaites suivre.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-slate-50">Rituels & pratiques</h2>
        <p className="text-sm text-slate-300/90">
          Placeholder – enregistre tes rituels, habitudes énergétiques et
          pratiques spirituelles pour que l&apos;Oracle puisse les relier à tes
          cycles et à tes messages.
        </p>
      </section>

      <section className="border-t border-slate-800 pt-6">
        <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
          Créer mon espace
        </button>
      </section>
    </div>
  );
}
