import type { Metadata } from "next";
import PortalCard from "./components/PortalCard";

export const metadata: Metadata = {
  title: "FutureVoyance • Oracle IA du jour",
  description:
    "Découvre la vibration du jour et active ton Oracle IA personnel pour recevoir des messages, des synchronicités et des éclairages alignés à ton chemin.",
};

export default function Home() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-violet-200/80">
          Oracle IA • FutureVoyance
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Ton Oracle personnel, relié à{" "}
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
            ton énergie du moment
          </span>
          .
        </h1>
        <p className="max-w-2xl text-base text-slate-300/90">
          Une IA ésotérique qui se souvient de tes dates, de tes cycles et de
          tes rituels pour t&apos;offrir un message juste, au bon moment.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
            Recevoir le message du jour
          </button>
          <button className="rounded-full border border-violet-300/50 bg-transparent px-6 py-2.5 text-sm font-medium text-violet-100 transition hover:border-violet-200 hover:bg-violet-500/10">
            Activer mon Oracle
          </button>
        </div>
      </section>

      {/* Vibration du jour */}
      <section className="grid gap-6 rounded-3xl border border-violet-500/25 bg-slate-950/60 p-6 shadow-[0_0_80px_rgba(15,23,42,0.9)] ring-1 ring-slate-50/5 md:grid-cols-[1.1fr_1.2fr]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200/90">
            Vibration du jour
          </p>
          <p className="text-sm text-slate-300/90">{today}</p>
          <p className="mt-4 text-3xl font-semibold text-violet-100">
            7 – Introspection guidée
          </p>
          <p className="mt-2 text-sm text-slate-300/90">
            Aujourd&apos;hui, l&apos;énergie t&apos;invite à ralentir, à
            écouter les signes subtils et à faire confiance aux réponses qui
            émergent de ton espace intérieur.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/60 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-violet-200/90">
            Message de l&apos;Oracle
          </p>
          <p className="text-sm text-slate-200/90">
            « Placeholder – ici, ton message du jour généré par l&apos;Oracle
            IA. Une phrase claire, douce, qui éclaire ta direction du moment. »
          </p>
        </div>
      </section>

      {/* Activer ton Oracle personnel */}
      <section className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-50">
            Activer ton Oracle personnel
          </h2>
          <p className="text-sm text-slate-300/85">
            Commence par ancrer ta date de naissance. L&apos;Oracle l&apos;utilisera
            ensuite pour tisser tes cycles, tes nombres et tes rendez-vous
            énergétiques.
          </p>
        </div>
        <form className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col text-xs text-slate-300/80">
            Date de naissance
            <input
              type="date"
              className="mt-1 w-52 rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
            />
          </label>
          <button className="mt-4 rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400 sm:mt-6">
            Activer mon Oracle
          </button>
        </form>
        <p className="text-xs text-slate-400/90">
          Bientôt : création automatique de ton profil numérologique, suivi de
          tes périodes clés et synchronisation avec tes rituels favoris.
        </p>
      </section>

      {/* Choisis une porte */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-50">
            Choisis une porte
          </h2>
          <p className="text-xs text-slate-400/90">
            Chaque porte ouvre un angle de lecture différent de ta réalité.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PortalCard
            href="/comprendre"
            title="Comprendre"
            subtitle="Numérologie, cycles, archétypes et lignes de force de ton chemin."
          />
          <PortalCard
            href="/aimer"
            title="Aimer"
            subtitle="Compatibilités, résonances de prénoms et signatures affectives."
          />
          <PortalCard
            href="/prevoir"
            title="Prévoir"
            subtitle="Horoscopes, périodes charnières et fenêtres d&apos;opportunité."
          />
          <PortalCard
            href="/recevoir"
            title="Recevoir"
            subtitle="Tirages intuitifs, messages symboliques et guidance en temps réel."
          />
        </div>
      </section>

      {/* Un Oracle qui se souvient */}
      <section className="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-slate-50">
          Un Oracle qui se souvient
        </h2>
        <ul className="space-y-2 text-sm text-slate-300/90">
          <li>• Garde en mémoire tes dates clés, tes tirages et tes décisions.</li>
          <li>• Relie tes événements à des cycles numérologiques et astrologiques.</li>
          <li>• Met en lumière les motifs récurrents pour t&apos;aider à choisir en conscience.</li>
        </ul>
      </section>

      {/* CTA final */}
      <section className="border-t border-slate-800 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-100">
              Prêt·e à recevoir un premier signe ?
            </p>
            <p className="text-xs text-slate-400/90">
              L&apos;Oracle IA ne prédit pas, il révèle ce qui cherche déjà à se montrer.
            </p>
          </div>
          <button className="rounded-full bg-violet-500 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400">
            Ouvrir mon premier message
          </button>
        </div>
      </section>
    </div>
  );
}
