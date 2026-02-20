"use client";

import { useState } from "react";
import type { NatalChart } from "@/lib/astrology/types";
import { SIGN_TEMPLATES, ZODIAC_SIGNS, ASTRO_COLORS } from "@/lib/astrology/constants";

type ChartInterpretationProps = {
  chart: NatalChart;
};

type TabId = "ascendant" | "planetes" | "domaines";

const TABS: { id: TabId; label: string }[] = [
  { id: "ascendant", label: "Ascendant" },
  { id: "planetes", label: "Planètes" },
  { id: "domaines", label: "Domaines" },
];

type DomainId = "amour" | "travail" | "social";

export default function ChartInterpretation({ chart }: ChartInterpretationProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ascendant");
  const [activeDomain, setActiveDomain] = useState<DomainId>("amour");

  // Find the sign name (English) for the rising sign
  const risingSignEn = ZODIAC_SIGNS.find(
    (z) => z.french === chart.risingSign
  )?.name;
  const template = risingSignEn
    ? SIGN_TEMPLATES[risingSignEn]
    : null;

  return (
    <div className="space-y-8">
      {/* ── Tab navigation ── */}
      <div className="flex gap-2 border-b border-[#E5E3DD]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              activeTab === tab.id
                ? "border-b-2 border-[#7C3AED] text-[#7C3AED]"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Ascendant tab ── */}
      {activeTab === "ascendant" && template && (
        <div className="space-y-6">
          <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-8 backdrop-blur-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
              Analyse Ascendant
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#1A1A1A]">
              Ascendant {chart.risingSign}
            </h3>
            <p className="mt-3 text-base italic text-[#1A1A1A]/60">
              &ldquo;{template.punchline}&rdquo;
            </p>
          </div>

          {/* Ruler */}
          <div className="rounded-md border border-[#E5E3DD] bg-[#FBFAF7] p-6 text-center">
            <p className="text-3xl">{chart.ascendantRuler.symbol}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A1A1A]/60">
              Maître de l&apos;ascendant
            </p>
            <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-medium text-[#1A1A1A]">
              {chart.ascendantRuler.french} en {chart.ascendantRuler.signFrench}
            </p>
          </div>

          {/* Aura + Atout/Défi */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
                Votre Aura
              </p>
              <p className="mt-2 text-base italic text-[#1A1A1A]/70">
                &ldquo;{template.aura}&rdquo;
              </p>
            </div>

            <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED]">
                    Atout
                  </p>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {template.atout}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#DB2777]">
                    Défi
                  </p>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {template.defi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Planètes tab ── */}
      {activeTab === "planetes" && (
        <div className="space-y-4">
          {chart.planets.map((planet) => (
            <div
              key={planet.planetId}
              className="flex items-center gap-4 rounded-md border border-[#E5E3DD] bg-white/60 p-5"
            >
              <span className="text-2xl">{planet.symbol}</span>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-playfair)] text-base font-medium text-[#1A1A1A]">
                  {planet.french} en {planet.signFrench}
                </p>
                <p className="text-xs text-[#1A1A1A]/50">
                  {planet.degree}° {planet.minutes}&prime; — Maison{" "}
                  {planet.house}
                  {planet.retrograde && (
                    <span
                      className="ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ color: ASTRO_COLORS.Feu, backgroundColor: `${ASTRO_COLORS.Feu}10` }}
                    >
                      Rétrograde
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Domaines tab ── */}
      {activeTab === "domaines" && template && (
        <div className="space-y-6">
          {/* Domain selector */}
          <div className="flex gap-2">
            {(["amour", "travail", "social"] as DomainId[]).map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                  activeDomain === domain
                    ? "bg-[#4A1D5B] text-white"
                    : "border border-[#E5E3DD] bg-white text-[#1A1A1A]/60 hover:border-[#7C3AED]/30"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Domain content */}
          <div className="rounded-md border border-[#E5E3DD] bg-[#FBFAF7] p-6">
            <p className="text-base italic leading-relaxed text-[#1A1A1A]/70">
              &ldquo;{template[activeDomain]}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
