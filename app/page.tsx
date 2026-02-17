import type { Metadata } from "next";
import PortalCard from "./components/PortalCard";
import DailyVibrationCombined from "./components/DailyVibrationCombined";
import OracleChat from "./components/OracleChat";
import ViewEvent from "./components/ViewEvent";
import { oracleOfDay } from "./lib/oracle";
import HeroOracle from "./components/HeroOracle";

export const metadata: Metadata = {
  title: "FutureVoyance • Oracle IA du jour",
  description:
    "Découvre la vibration du jour et active ton Oracle IA personnel pour recevoir des messages, des synchronicités et des éclairages alignés à ton chemin.",
};

export default function Home() {
  const now = new Date();
  const todayLabel = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dayOracle = oracleOfDay(now);

  return (
    <div className="space-y-32">
      <ViewEvent name="view_oracle_home" />

      {/* Hero Oracle */}
      <HeroOracle />

      {/* Combined: Vibration du jour + Résonance personnelle */}
      <DailyVibrationCombined todayLabel={todayLabel} initialDayOracle={dayOracle} />

      {/* Oracle Input */}
      <div id="oracle" />
      <section id="oracle-chat" className="mx-auto max-w-3xl">
        <OracleChat />
      </section>

      {/* Day Oracle (moved above as part of combined section) */}

      {/* Portals */}
      <section className="space-y-16">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[#1A1A1A] md:text-5xl">
            Quatre portes
          </h2>
          <p className="mt-4 text-sm text-[#1A1A1A]/50">
            Chaque porte ouvre un angle différent de ta réalité
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <PortalCard
            href="/comprendre"
            title="Comprendre"
            subtitle="Numérologie, cycles, archétypes et lignes de force de ton chemin."
            accentColor="var(--comprendre)"
          />
          <PortalCard
            href="/aimer"
            title="Aimer"
            subtitle="Compatibilités, résonances de prénoms et signatures affectives."
            accentColor="var(--aimer)"
          />
          <PortalCard
            href="/prevoir"
            title="Prévoir"
            subtitle="Horoscopes, périodes charnières et fenêtres d&apos;opportunité."
            accentColor="var(--prevoir)"
          />
          <PortalCard
            href="/recevoir"
            title="Recevoir"
            subtitle="Tirages intuitifs, messages symboliques et guidance en temps réel."
            accentColor="var(--recevoir)"
          />
        </div>
      </section>

      {/* Memory */}
      <section className="mx-auto max-w-2xl space-y-6 border-t border-[#1A1A1A]/10 py-20 text-center">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
          Un Oracle qui se souvient
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-[#1A1A1A]/60">
          <p>Garde en mémoire tes dates clés, tes tirages et tes décisions.</p>
          <p>Relie tes événements à des cycles numérologiques et astrologiques.</p>
          <p>Met en lumière les motifs récurrents pour t'aider à choisir en conscience.</p>
        </div>
      </section>
    </div>
  );
}
