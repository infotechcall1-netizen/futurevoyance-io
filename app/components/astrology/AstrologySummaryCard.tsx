"use client";

import type { NatalChart } from "@/lib/astrology/types";

type AstrologySummaryCardProps = {
  chart: NatalChart;
};

export default function AstrologySummaryCard({ chart }: AstrologySummaryCardProps) {
  const sun = chart.planets.find((p) => p.planetId === "sun");
  const moon = chart.planets.find((p) => p.planetId === "moon");

  const items = [
    { label: "Soleil", value: chart.sunSign, symbol: sun?.symbol ?? "☉" },
    { label: "Lune", value: chart.moonSign, symbol: moon?.symbol ?? "☽" },
    { label: "Ascendant", value: chart.risingSign, symbol: "↑" },
  ];

  return (
    <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 backdrop-blur-sm">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
        Signature Astrale
      </p>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl">{item.symbol}</p>
            <p className="mt-1 font-[family-name:var(--font-playfair)] text-sm font-medium text-[#1A1A1A]">
              {item.value}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
