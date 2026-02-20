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
  title: string;
  description: string;
  advice: string;
  vib1: number;
  vib2: number;
};

/** Compatibility table between vibration pairs (simplified) */
const VIBE_COMPAT: Record<string, { score: number; title: string; description: string; advice: string }> = {
  // Same vibration
  "same": {
    score: 7,
    title: "Miroir vibratoire",
    description: "Vous partagez la même énergie fondamentale. Une compréhension intuitive profonde, mais attention au risque d'amplifier les mêmes patterns.",
    advice: "Cultivez vos différences pour vous enrichir mutuellement.",
  },
  // Complementary pairs (1+2, 3+6, 4+8, 5+9, 7+11, 22+33)
  "1-2": { score: 9, title: "Leader & Soutien", description: "L'élan du 1 trouve dans le 2 un terrain d'atterrissage parfait. Vous vous complétez naturellement.", advice: "Laissez le 1 initier, le 2 affiner — ensemble vous accomplissez." },
  "3-6": { score: 9, title: "Créativité & Harmonie", description: "L'expression du 3 s'épanouit dans l'espace chaleureux que crée le 6. Une résonance artistique et affective rare.", advice: "Créez ensemble, partagez vos créations avec le monde." },
  "4-8": { score: 9, title: "Fondation & Maîtrise", description: "La structure du 4 et la puissance du 8 construisent ensemble quelque chose qui dure. Confiance réciproque.", advice: "Visez des projets concrets et durables ensemble." },
  "5-9": { score: 8, title: "Aventure & Sagesse", description: "La liberté du 5 et la profondeur du 9 créent un voyage riche. Ensemble vous explorez et transmutez.", advice: "Laissez la curiosité du 5 guider, la sagesse du 9 intégrer." },
  "1-9": { score: 7, title: "Début & Fin", description: "L'alpha et l'oméga. Vous représentez ensemble un cycle complet — une relation de transformation mutuelle.", advice: "Honorez vos différences de rythme comme une richesse." },
  "2-4": { score: 8, title: "Alliance douce", description: "La sensibilité du 2 trouve dans la stabilité du 4 un ancrage précieux. Une paix naturelle.", advice: "Construisez votre espace commun avec patience." },
  "3-5": { score: 8, title: "Joie & Mouvement", description: "Deux énergies légères qui s'amplifient mutuellement. Créativité, aventure et rires au programme.", advice: "Donnez aussi de la profondeur à votre lien." },
  "6-8": { score: 7, title: "Soin & Puissance", description: "L'amour du 6 et la force du 8 peuvent beaucoup accomplir. Attention à l'équilibre des rôles.", advice: "Veillez à ce que le 6 ne s'efface pas devant le 8." },
  "7-11": { score: 9, title: "Mystère & Vision", description: "Deux âmes profondes qui se reconnaissent. Une connexion intuitive presque télépathique.", advice: "Honorez votre besoin de silence et d'espace chacun." },
  "22-33": { score: 10, title: "Architectes du Monde", description: "Une rencontre de nombres maîtres. Ensemble, vous portez le potentiel de bâtir quelque chose de transcendant.", advice: "Canalisez cette énergie immense vers une vision commune." },
};

function compatKey(v1: number, v2: number): string {
  if (v1 === v2) return "same";
  const [a, b] = [Math.min(v1, v2), Math.max(v1, v2)];
  return `${a}-${b}`;
}

const DEFAULT_COMPAT = {
  score: 6,
  title: "Vibrations distinctes",
  description: "Vos énergies sont différentes mais complémentaires à leur façon. La rencontre crée une dynamique unique.",
  advice: "Explorez ce que l'autre éveille en vous — c'est votre zone de croissance.",
};

/**
 * Calculate compatibility between two first names.
 */
export function firstNameCompatibility(name1: string, name2: string): NameCompatibilityResult {
  const vib1 = firstNameVibration(name1);
  const vib2 = firstNameVibration(name2);

  if (vib1 === 0 || vib2 === 0) {
    return {
      score: 0,
      title: "—",
      description: "Entre deux prénoms pour découvrir votre compatibilité.",
      advice: "",
      vib1,
      vib2,
    };
  }

  const key = compatKey(vib1, vib2);
  const compat = VIBE_COMPAT[key] ?? DEFAULT_COMPAT;

  return { ...compat, vib1, vib2 };
}
