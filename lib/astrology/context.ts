// ─── Astrology Context for Oracle AI ──────────────────────────────
// Converts a NatalChart into a concise text block
// for injection into the Vertex AI system prompt.

import type { NatalChart } from "./types";

/**
 * Build a concise natal context string for the Oracle AI.
 * This is appended to the system prompt when the user has birth data.
 *
 * ~200 tokens — well within Gemini 2.0 Flash's budget.
 */
export function buildNatalContext(chart: NatalChart): string {
  const planetSummary = chart.planets
    .map(
      (p) =>
        `${p.french} en ${p.signFrench} (${p.degree}°${p.retrograde ? " R" : ""})`
    )
    .join(", ");

  const aspectSummary = chart.aspects
    .slice(0, 8) // top 8 aspects to keep it concise
    .map((a) => `${a.planet1} ${a.french} ${a.planet2}`)
    .join(", ");

  return `
DONNÉES ASTROLOGIQUES DU CONSULTANT :
- Signe solaire : ${chart.sunSign}
- Signe lunaire : ${chart.moonSign}
- Ascendant : ${chart.risingSign}
- Maître de l'ascendant : ${chart.ascendantRuler.french} en ${chart.ascendantRuler.signFrench}
- Planètes : ${planetSummary}
- Aspects majeurs : ${aspectSummary}
- Lieu de naissance : ${chart.metadata.location}

Utilise ces données pour personnaliser ta réponse.
Relie les énergies planétaires aux thèmes de la question.
Ne récite pas les données brutes. Intègre-les naturellement dans ta lecture symbolique.
`.trim();
}
