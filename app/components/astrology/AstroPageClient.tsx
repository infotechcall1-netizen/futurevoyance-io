"use client";

import { useState } from "react";
import BirthDataForm from "./BirthDataForm";
import NatalChartWheel from "./NatalChartWheel";
import ChartInterpretation from "./ChartInterpretation";
import AstrologySummaryCard from "./AstrologySummaryCard";
import { generateNatalChart } from "@/lib/astrology/engine";
import type { NatalChart } from "@/lib/astrology/types";

type AstroPageClientProps = {
  /** Pre-computed chart from server if user already has birth data */
  initialChart: NatalChart | null;
  /** Whether user has saved birth data in DB */
  hasBirthData: boolean;
};

export default function AstroPageClient({
  initialChart,
  hasBirthData,
}: AstroPageClientProps) {
  const [chart, setChart] = useState<NatalChart | null>(initialChart);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(hasBirthData);
  const [showForm, setShowForm] = useState(!hasBirthData);

  const handleSubmit = async (data: {
    birthDate: string;
    birthTime: string;
    birthCity: string;
    latitude: number;
    longitude: number;
  }) => {
    setLoading(true);

    // Build the birth Date object
    const [year, month, day] = data.birthDate.split("-").map(Number);
    const [hours, mins] = (data.birthTime || "12:00").split(":").map(Number);
    const birthDate = new Date(year, month - 1, day, hours, mins);

    // Compute chart client-side (instant, no API cost)
    const natalChart = generateNatalChart(
      "",
      birthDate,
      data.latitude,
      data.longitude,
      data.birthCity,
      "UTC"
    );

    setChart(natalChart);

    // Save birth data to DB in background
    try {
      await fetch("/api/user/birth-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: birthDate.toISOString(),
          birthCity: data.birthCity,
          birthLat: data.latitude,
          birthLon: data.longitude,
          birthTimezone: "UTC",
        }),
      });
      setSaved(true);
    } catch (err) {
      console.error("[astro] Failed to save birth data:", err);
    }

    setLoading(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-12">
      {/* ── Form section ── */}
      {showForm && (
        <section>
          <BirthDataForm onSubmit={handleSubmit} loading={loading} />
        </section>
      )}

      {/* ── Chart results ── */}
      {chart && !showForm && (
        <>
          {/* Summary card */}
          <AstrologySummaryCard chart={chart} />

          {/* Edit button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="text-xs font-medium text-[#7C3AED] underline underline-offset-4 transition hover:text-[#6D28D9]"
            >
              Modifier mes données de naissance
            </button>
          </div>

          {/* Natal chart wheel */}
          <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
              Carte du Ciel
            </p>
            <NatalChartWheel chart={chart} />
            <p className="mt-4 text-center text-xs italic text-[#1A1A1A]/40">
              &ldquo;Les astres inclinent, ils ne déterminent pas. Vous restez
              maître de votre lumière.&rdquo;
            </p>
          </section>

          {/* Interpretation */}
          <section>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
              Interprétation
            </p>
            <ChartInterpretation chart={chart} />
          </section>

          {/* Éphémérides table */}
          <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
              Éphémérides de naissance
            </p>
            <div className="overflow-x-auto rounded-md border border-[#E5E3DD]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E3DD] bg-[#FBFAF7]">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Astre
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Signe
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Degré
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Rétrograde
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chart.planets.map((planet) => (
                    <tr
                      key={planet.planetId}
                      className="border-b border-[#E5E3DD]/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                        {planet.symbol} {planet.french}
                      </td>
                      <td className="px-4 py-3 text-[#1A1A1A]/70">
                        {planet.signFrench}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#1A1A1A]/50">
                        {planet.degree}° {planet.minutes}&prime;
                      </td>
                      <td className="px-4 py-3">
                        {planet.retrograde ? (
                          <span className="text-xs font-bold text-[#DB2777]">
                            R
                          </span>
                        ) : (
                          <span className="text-[#1A1A1A]/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
