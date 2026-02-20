/**
 * lib/numerology/index.ts
 * Pythagorean numerology — first name vibration calculator.
 *
 * Letter → value mapping:
 *   A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9
 *   J=1 K=2 L=3 M=4 N=5 O=6 P=7 Q=8 R=9
 *   S=1 T=2 U=3 V=4 W=5 X=6 Y=7 Z=8
 *
 * Accent-insensitive (French names: é→e, à→a, ç→c, etc.)
 * Master numbers 11, 22, 33 are preserved.
 */

import { ORACLE_VIBRATIONS } from "@/app/lib/oracle";

const PYTHAGOREAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

/** Normalize accented French characters to their base ASCII equivalent */
function normalizeChar(char: string): string {
  return char
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Return the Pythagorean value of a single letter (0 if not a letter) */
export function letterValue(char: string): number {
  const normalized = normalizeChar(char);
  return PYTHAGOREAN[normalized] ?? 0;
}

/**
 * Reduce a sum to a single digit, preserving master numbers 11, 22, 33.
 */
function reduceMaster(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((s, c) => s + Number(c), 0);
  }
  return n;
}

/**
 * Calculate the Pythagorean vibration of a first name.
 * Returns a number 1–9, 11, 22, or 33.
 */
export function firstNameVibration(firstName: string): number {
  if (!firstName.trim()) return 0;

  const sum = firstName
    .split("")
    .reduce((acc, char) => acc + letterValue(char), 0);

  return sum === 0 ? 0 : reduceMaster(sum);
}

/**
 * Return the keyword for a given vibration number from the oracle dictionary.
 */
export function vibrationKeyword(vibration: number): string {
  return ORACLE_VIBRATIONS[vibration]?.keyword ?? "";
}

/**
 * Return the title for a given vibration number.
 */
export function vibrationTitle(vibration: number): string {
  return ORACLE_VIBRATIONS[vibration]?.title ?? "";
}

export type NameCompatibilityResult = {
  score: number;       // 1–10
  coupleNumber: number; // le nombre du couple (1-9, 11, 22, 33)
  title: string;
  description: string;
  advice: string;
  vib1: number;
  vib2: number;
};

/**
 * Table du nombre couple — couvre TOUS les résultats possibles (1-9, 11, 22, 33).
 * Algorithme : vib1 + vib2 → réduit → nombre couple → lecture unique.
 * Inspiré de futurevoyance.com/compatibilite-amoureuse-numerologie-prenoms/
 */
const COUPLE_READINGS: Record<number, { score: number; title: string; description: string; advice: string }> = {
  1: {
    score: 7,
    title: "Couple Pionnier",
    description: "Votre union vibre sur la fréquence des débuts et de l'indépendance. Deux êtres forts qui peuvent s'inspirer mutuellement à condition de laisser de l'espace à l'autre.",
    advice: "Cultivez vos projets individuels autant que vos projets communs — votre force naît de votre liberté respective.",
  },
  2: {
    score: 9,
    title: "Couple Fusionnel",
    description: "Le 2 est la vibration du couple par excellence. Écoute, douceur, complémentarité — votre lien repose sur une harmonie rare et une compréhension intuitive profonde.",
    advice: "Chérissez ces moments de silence partagé. Votre connexion se nourrit de la qualité de votre présence l'un à l'autre.",
  },
  3: {
    score: 8,
    title: "Couple Créatif",
    description: "La joie, la communication et l'expression sont au cœur de votre relation. Ensemble, vous attirez la lumière et créez de la beauté autour de vous.",
    advice: "Gardez vivant le plaisir de vous surprendre — improvisez, riez, créez ensemble régulièrement.",
  },
  4: {
    score: 7,
    title: "Couple Bâtisseur",
    description: "Votre lien est solide comme la pierre. Fidélité, engagement et sens du concret définissent votre couple. Vous construisez ensemble quelque chose qui dure.",
    advice: "Introduisez de la légèreté et de la spontanéité pour éviter la routine — la stabilité est une force, pas une cage.",
  },
  5: {
    score: 7,
    title: "Couple Aventurier",
    description: "Le changement, la liberté et l'intensité marquent votre relation. Une passion vive et une attraction magnétique — mais vous aurez besoin de vous ancrer.",
    advice: "Trouvez ensemble un socle stable tout en honorant votre besoin commun de mouvement et de nouveauté.",
  },
  6: {
    score: 9,
    title: "Couple Harmonieux",
    description: "L'amour, la famille et la beauté sont au centre de votre vibration commune. Votre relation rayonne d'une chaleur qui nourrit tous ceux qui vous entourent.",
    advice: "Prenez soin de votre cocon tout en vous ouvrant au monde — votre amour a quelque chose à offrir au-delà de vous deux.",
  },
  7: {
    score: 7,
    title: "Couple Mystique",
    description: "Votre lien est profond, introspectif et porté par une quête commune de sens. Vous vous reconnaissez dans l'âme plutôt que dans l'apparence.",
    advice: "Acceptez les silences et les retraits de l'autre — votre amour se nourrit de profondeur, pas de surface.",
  },
  8: {
    score: 7,
    title: "Couple Puissant",
    description: "L'ambition, le leadership et la maîtrise caractérisent votre union. Ensemble vous pouvez accomplir de grandes choses, à condition d'éviter la compétition.",
    advice: "Définissez clairement vos rôles et célébrez les victoires de l'autre — votre force devient décuplée quand elle est unifiée.",
  },
  9: {
    score: 8,
    title: "Couple Universel",
    description: "Votre relation vibre sur la fréquence de la sagesse, de la générosité et de l'accomplissement. Un lien marqué par la transformation et le dépassement.",
    advice: "Gardez de la place pour vos chemins individuels — votre union s'enrichit de ce que chacun vit et transmet.",
  },
  11: {
    score: 9,
    title: "Couple Vision",
    description: "Le nombre maître 11 illumine votre union. Une connexion rare, presque télépathique, portée par une sensibilité et une intuition communes extraordinaires.",
    advice: "Ancrez votre lien dans le quotidien concret — l'idéal se construit aussi avec les petites choses du jour.",
  },
  22: {
    score: 10,
    title: "Couple Architecte",
    description: "Le plus puissant des nombres maîtres préside à votre union. Ensemble vous pouvez bâtir quelque chose de transcendant — une famille, une œuvre, un héritage.",
    advice: "Canalisez cette énergie immense avec discernement. Votre potentiel ensemble ne connaît presque pas de limites.",
  },
  33: {
    score: 9,
    title: "Couple Enseignant",
    description: "Le maître-enseignant préside à votre lien. Votre relation est marquée par la compassion, le service et un amour qui dépasse vos deux personnes.",
    advice: "Prenez soin de ne pas vous oublier dans le don aux autres — votre union se ressource dans l'amour reçu autant que donné.",
  },
};

/**
 * Calculate compatibility between two first names using the "couple number" method.
 *
 * Algorithm (same as futurevoyance.com):
 *   1. vib1 = Pythagorean sum of name1 (reduced, master numbers preserved)
 *   2. vib2 = Pythagorean sum of name2 (reduced, master numbers preserved)
 *   3. raw  = vib1 + vib2
 *   4. coupleNumber = reduceMaster(raw) → always 1-9, 11, 22, or 33
 *   5. Look up coupleNumber in COUPLE_READINGS → unique result every time
 */
export function firstNameCompatibility(name1: string, name2: string): NameCompatibilityResult {
  const vib1 = firstNameVibration(name1);
  const vib2 = firstNameVibration(name2);

  if (vib1 === 0 || vib2 === 0) {
    return {
      score: 0,
      coupleNumber: 0,
      title: "—",
      description: "Entre deux prénoms pour découvrir votre compatibilité.",
      advice: "",
      vib1,
      vib2,
    };
  }

  const coupleNumber = reduceMaster(vib1 + vib2);
  const reading = COUPLE_READINGS[coupleNumber] ?? COUPLE_READINGS[9]!;

  return { ...reading, coupleNumber, vib1, vib2 };
}
