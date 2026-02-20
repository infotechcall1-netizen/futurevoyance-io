/**
 * lib/compatibility/index.ts
 * Sign compatibility based on astrological elements.
 * Also re-exports name compatibility from lib/numerology.
 */

import { ZODIAC_SIGNS } from "@/lib/astrology/constants";
import { firstNameCompatibility } from "@/lib/numerology";
export { firstNameCompatibility };
export type { NameCompatibilityResult } from "@/lib/numerology";

// ─── Types ─────────────────────────────────────────────────────────────

export type Element = "Feu" | "Terre" | "Air" | "Eau";

export type SignCompatibilityResult = {
  score: number;       // 1–10
  title: string;
  description: string;
  advice: string;
  element1: Element;
  element2: Element;
};

// ─── Element → portal color mapping ────────────────────────────────────

export const ELEMENT_COLORS: Record<Element, string> = {
  Feu:   "#DB2777",   // Aimer (pink)
  Terre: "#059669",   // Recevoir (green)
  Air:   "#2563EB",   // Prévoir (blue)
  Eau:   "#7C3AED",   // Comprendre (purple)
};

// ─── Compatibility matrix ───────────────────────────────────────────────

type CompatData = { score: number; title: string; description: string; advice: string };

const ELEMENT_COMPAT: Record<string, CompatData> = {
  // Highly compatible (complementary elements)
  "Feu-Air": {
    score: 9,
    title: "Alchimie naturelle",
    description: "Le Feu et l'Air s'alimentent mutuellement. L'air attise les flammes, le feu réchauffe l'air. Une énergie vive, créative et inspirante.",
    advice: "Canalisez votre enthousiasme partagé vers des projets concrets.",
  },
  "Terre-Eau": {
    score: 9,
    title: "Profondeur commune",
    description: "La Terre ancre l'Eau, l'Eau nourrit la Terre. Une relation de sécurité profonde où chacun trouve sa place naturelle.",
    advice: "Prenez le temps de construire lentement — vous en valez la peine.",
  },

  // Compatible (same element)
  "Feu-Feu": {
    score: 7,
    title: "Flammes jumelles",
    description: "Deux feux ensemble créent une chaleur intense. Passion, ambition et vie sociale abondante. Attention à ne pas tout consumer.",
    advice: "Apprenez à vous refroidir mutuellement quand nécessaire.",
  },
  "Terre-Terre": {
    score: 7,
    title: "Socle solide",
    description: "Deux Terres construisent ensemble quelque chose qui dure. Fidélité, pragmatisme et sens du concret. Un couple bâtisseur.",
    advice: "Osez sortir de votre zone de confort pour garder la flamme.",
  },
  "Air-Air": {
    score: 7,
    title: "Esprits libres",
    description: "Deux Airs se comprennent sans avoir besoin de tout expliquer. Communication fluide, liberté partagée, curiosité mutuelle.",
    advice: "Ancrez parfois vos idées dans le réel pour qu'elles se réalisent.",
  },
  "Eau-Eau": {
    score: 7,
    title: "Âmes sœurs",
    description: "L'empathie entre deux signes Eau est presque télépathique. Une profondeur émotionnelle rare, une intuition partagée.",
    advice: "Veillez à ne pas vous noyer ensemble — gardez vos territoires individuels.",
  },

  // Neutral / growth-oriented
  "Feu-Terre": {
    score: 5,
    title: "Force et lenteur",
    description: "Le Feu veut aller vite, la Terre consolide. Des rythmes différents qui demandent du respect mutuel pour trouver leur harmonie.",
    advice: "Célébrez vos différences de pace — l'un vous donne de l'élan, l'autre de la durée.",
  },
  "Air-Eau": {
    score: 5,
    title: "Tête et cœur",
    description: "L'Air pense, l'Eau ressent. Une tension créatrice qui peut devenir complémentarité quand les deux acceptent leur nature.",
    advice: "Apprenez la langue de l'autre : les mots pour l'Air, les émotions pour l'Eau.",
  },

  // Challenging
  "Feu-Eau": {
    score: 4,
    title: "Contraires qui s'attirent",
    description: "Le Feu et l'Eau sont des opposés fascinants. L'intensité est forte, mais les besoins fondamentaux divergent. Une relation de transformation.",
    advice: "Respectez le besoin d'espace du Feu et le besoin de sécurité de l'Eau.",
  },
  "Air-Terre": {
    score: 4,
    title: "Altitude et profondeur",
    description: "L'Air vole, la Terre s'enracine. Des visions du monde différentes qui peuvent s'enrichir mutuellement avec de la patience.",
    advice: "La Terre donne à l'Air un ancrage, l'Air offre à la Terre de la légèreté.",
  },
};

function elementKey(e1: Element, e2: Element): string {
  // Canonical order for consistent lookup
  const pairs: [Element, Element][] = [
    ["Feu", "Air"], ["Terre", "Eau"],
    ["Feu", "Feu"], ["Terre", "Terre"], ["Air", "Air"], ["Eau", "Eau"],
    ["Feu", "Terre"], ["Air", "Eau"],
    ["Feu", "Eau"], ["Air", "Terre"],
  ];

  for (const [a, b] of pairs) {
    if ((e1 === a && e2 === b) || (e1 === b && e2 === a)) {
      return `${a}-${b}`;
    }
  }
  return `${e1}-${e2}`;
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Return the astrological element for a sign (by French name or English name).
 * Example: getZodiacElement("Lion") → "Feu"
 */
export function getZodiacElement(signName: string): Element | null {
  const sign = ZODIAC_SIGNS.find(
    (s) =>
      s.french.toLowerCase() === signName.toLowerCase() ||
      s.name.toLowerCase() === signName.toLowerCase()
  );
  return (sign?.element as Element) ?? null;
}

/**
 * Calculate astrological compatibility between two zodiac signs.
 * Accepts French or English sign names.
 */
export function signCompatibility(
  sign1: string,
  sign2: string
): SignCompatibilityResult | null {
  const element1 = getZodiacElement(sign1);
  const element2 = getZodiacElement(sign2);

  if (!element1 || !element2) return null;

  const key = elementKey(element1, element2);
  const compat = ELEMENT_COMPAT[key] ?? {
    score: 6,
    title: "Connexion unique",
    description: "Une combinaison singulière qui porte ses propres mystères.",
    advice: "Explorez ensemble ce que cette rencontre éveille en vous.",
  };

  return { ...compat, element1, element2 };
}
