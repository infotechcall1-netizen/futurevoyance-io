import type { Metadata } from "next";
import PortalCard from "./components/PortalCard";
import OracleLive from "./components/OracleLive";
import OracleChat from "./components/OracleChat";
import ViewEvent from "./components/ViewEvent";
import { oracleOfDay } from "./lib/oracle";

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
      
      {/* Hero */}
      <section className="relative py-32 md:py-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.02]">
          <span className="font-[family-name:var(--font-playfair)] text-[20vw] font-bold leading-none tracking-tighter text-gray-400">
            ORACLE
          </span>
        </div>
        
        <div className="relative mx-auto max-w-4xl space-y-16 text-center">
          <div className="space-y-8">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#C9A961]">
              FutureVoyance
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-6xl font-semibold leading-[1.08] tracking-tight text-[#1A1A1A] md:text-7xl lg:text-8xl">
              L'Oracle qui{" "}
              <span className="italic text-[#7C3AED]">révèle</span>
            </h1>
          </div>
          
          <div className="mx-auto max-w-xl">
            <a
              href="#oracle-chat"
              className="group inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-12 py-5 text-base font-medium text-white shadow-sm transition-all hover:bg-[#6D28D9]"
            >
              Recevoir ton message
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Oracle Input */}
      <section id="oracle-chat" className="mx-auto max-w-3xl">
        <OracleChat />
      </section>

      {/* Day Oracle */}
      <OracleLive todayLabel={todayLabel} initialDayOracle={dayOracle} />

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
