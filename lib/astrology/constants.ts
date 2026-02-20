// ─── Astrology Data Constants ─────────────────────────────────────
// All reference data for the natal chart system.

import type { ZodiacSign, Planet, AspectType, SignTemplate } from "./types";

// ─── Zodiac Signs ─────────────────────────────────────────────────

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { index: 0,  name: "Aries",       french: "Bélier",      symbol: "♈", element: "Feu",   modality: "Cardinal" },
  { index: 1,  name: "Taurus",      french: "Taureau",     symbol: "♉", element: "Terre", modality: "Fixe" },
  { index: 2,  name: "Gemini",      french: "Gémeaux",     symbol: "♊", element: "Air",   modality: "Mutable" },
  { index: 3,  name: "Cancer",      french: "Cancer",      symbol: "♋", element: "Eau",   modality: "Cardinal" },
  { index: 4,  name: "Leo",         french: "Lion",        symbol: "♌", element: "Feu",   modality: "Fixe" },
  { index: 5,  name: "Virgo",       french: "Vierge",      symbol: "♍", element: "Terre", modality: "Mutable" },
  { index: 6,  name: "Libra",       french: "Balance",     symbol: "♎", element: "Air",   modality: "Cardinal" },
  { index: 7,  name: "Scorpio",     french: "Scorpion",    symbol: "♏", element: "Eau",   modality: "Fixe" },
  { index: 8,  name: "Sagittarius", french: "Sagittaire",  symbol: "♐", element: "Feu",   modality: "Mutable" },
  { index: 9,  name: "Capricorn",   french: "Capricorne",  symbol: "♑", element: "Terre", modality: "Cardinal" },
  { index: 10, name: "Aquarius",    french: "Verseau",     symbol: "♒", element: "Air",   modality: "Fixe" },
  { index: 11, name: "Pisces",      french: "Poissons",    symbol: "♓", element: "Eau",   modality: "Mutable" },
];

// ─── Planets ──────────────────────────────────────────────────────

export const PLANETS: Planet[] = [
  { id: "sun",     name: "Sun",     french: "Soleil",   symbol: "☉" },
  { id: "moon",    name: "Moon",    french: "Lune",     symbol: "☽" },
  { id: "mercury", name: "Mercury", french: "Mercure",  symbol: "☿" },
  { id: "venus",   name: "Venus",   french: "Vénus",    symbol: "♀" },
  { id: "mars",    name: "Mars",    french: "Mars",     symbol: "♂" },
  { id: "jupiter", name: "Jupiter", french: "Jupiter",  symbol: "♃" },
  { id: "saturn",  name: "Saturn",  french: "Saturne",  symbol: "♄" },
  { id: "uranus",  name: "Uranus",  french: "Uranus",   symbol: "♅" },
  { id: "neptune", name: "Neptune", french: "Neptune",  symbol: "♆" },
  { id: "pluto",   name: "Pluto",   french: "Pluton",   symbol: "♇" },
];

// ─── Sign Rulers ──────────────────────────────────────────────────

export const SIGN_RULERS: Record<string, string> = {
  Aries:       "Mars",
  Taurus:      "Venus",
  Gemini:      "Mercury",
  Cancer:      "Moon",
  Leo:         "Sun",
  Virgo:       "Mercury",
  Libra:       "Venus",
  Scorpio:     "Pluto",
  Sagittarius: "Jupiter",
  Capricorn:   "Saturn",
  Aquarius:    "Uranus",
  Pisces:      "Neptune",
};

// ─── Aspects ──────────────────────────────────────────────────────

export const ASPECTS: AspectType[] = [
  { name: "Conjunction", french: "Conjonction", symbol: "☌", angle: 0,   orb: 8 },
  { name: "Sextile",     french: "Sextile",     symbol: "⚹", angle: 60,  orb: 6 },
  { name: "Square",      french: "Carré",       symbol: "□", angle: 90,  orb: 7 },
  { name: "Trine",       french: "Trigone",      symbol: "△", angle: 120, orb: 8 },
  { name: "Quincunx",    french: "Quinconce",    symbol: "⚻", angle: 150, orb: 3 },
  { name: "Opposition",  french: "Opposition",   symbol: "☍", angle: 180, orb: 8 },
];

// ─── Design Colors ────────────────────────────────────────────────

export const ASTRO_COLORS = {
  primary:  "#4A1D5B",
  gold:     "#C5A059",
  bg:       "#FBFAF7",
  border:   "#E5E3DD",
  // Element colors mapped to FutureVoyance portals
  Feu:   "#DB2777", // Aimer (pink)
  Terre: "#059669", // Recevoir (green)
  Air:   "#2563EB", // Prévoir (blue)
  Eau:   "#7C3AED", // Comprendre (violet)
} as const;

// ─── Sign Interpretation Templates ────────────────────────────────

export const SIGN_TEMPLATES: Record<string, SignTemplate> = {
  Aries: {
    punchline: "L'énergie pure d'un commencement perpétuel.",
    aura: "Magnétique, franche et pionnière.",
    atout: "Courage instinctif",
    defi: "Patience et persévérance",
    amour: "Passion fougueuse et conquérante.",
    travail: "Leader naturel, esprit d'initiative.",
    social: "Dynamique et entraînant.",
  },
  Taurus: {
    punchline: "La force tranquille qui bâtit des empires.",
    aura: "Apaisante, sensuelle et fiable.",
    atout: "Ténacité inébranlable",
    defi: "Lâcher prise et s'adapter",
    amour: "Fidèle et profondément sensuel.",
    travail: "Constructeur patient et méthodique.",
    social: "Présence rassurante et hospitalière.",
  },
  Gemini: {
    punchline: "Le messager des mondes, entre ciel et terre.",
    aura: "Vive, curieuse et communicative.",
    atout: "Adaptabilité intellectuelle",
    defi: "Se poser et approfondir",
    amour: "Jeu de l'esprit et complicité.",
    travail: "Polyvalent et brillant communicant.",
    social: "Connecteur de cercles et d'idées.",
  },
  Cancer: {
    punchline: "Le gardien des mémoires et des âmes.",
    aura: "Protectrice, intuitive et nourricière.",
    atout: "Intelligence émotionnelle",
    defi: "Sortir de sa coquille",
    amour: "Dévouement profond et maternel.",
    travail: "Intuitif et protecteur de son équipe.",
    social: "Créateur de foyers et de liens durables.",
  },
  Leo: {
    punchline: "Le soleil incarné, rayonnant et généreux.",
    aura: "Royale, chaleureuse et magnétique.",
    atout: "Charisme naturel",
    defi: "L'humilité et le partage du trône",
    amour: "Romance grandiose et loyauté ardente.",
    travail: "Visionnaire et leader inspirant.",
    social: "Centre lumineux de tout rassemblement.",
  },
  Virgo: {
    punchline: "L'alchimiste du quotidien, la perfection discrète.",
    aura: "Raffinée, analytique et serviable.",
    atout: "Précision et discernement",
    defi: "Accepter l'imperfection",
    amour: "Attention aux détails et dévouement silencieux.",
    travail: "Maître de l'organisation et de l'analyse.",
    social: "Aide discrète et conseiller de confiance.",
  },
  Libra: {
    punchline: "L'art de l'équilibre dans un monde mobile.",
    aura: "Diplomate, harmonieuse et lissante.",
    atout: "Sens de la justice",
    defi: "Oser choisir",
    amour: "Partage équilibré et idéal esthétique.",
    travail: "Médiateur et stratège des relations.",
    social: "Tisseur de liens et artisan de paix.",
  },
  Scorpio: {
    punchline: "La puissance de la transformation absolue.",
    aura: "Magnétique, intense et pénétrante.",
    atout: "Profondeur psychologique",
    defi: "Le pardon et le lâcher-prise",
    amour: "Passion totale et fusion émotionnelle.",
    travail: "Investigateur né, stratège de l'ombre.",
    social: "Loyauté farouche et cercle restreint.",
  },
  Sagittarius: {
    punchline: "L'archer qui vise les étoiles sans trembler.",
    aura: "Aventurière, optimiste et philosophe.",
    atout: "Vision et enthousiasme",
    defi: "S'ancrer dans le concret",
    amour: "Aventure partagée et liberté mutuelle.",
    travail: "Explorateur et inspirateur de vocations.",
    social: "Conteur et ouvreur de horizons.",
  },
  Capricorn: {
    punchline: "Le bâtisseur silencieux des sommets.",
    aura: "Austère, déterminée et respectée.",
    atout: "Discipline et ambition",
    defi: "S'autoriser la légèreté",
    amour: "Engagement solide et fidélité de granit.",
    travail: "Architecte de carrières et d'institutions.",
    social: "Mentor et pilier de confiance.",
  },
  Aquarius: {
    punchline: "Le visionnaire qui marche en avance sur son temps.",
    aura: "Originale, libre et humaniste.",
    atout: "Innovation et indépendance",
    defi: "L'intimité émotionnelle",
    amour: "Complicité intellectuelle et liberté.",
    travail: "Inventeur et réformateur des systèmes.",
    social: "Fédérateur de causes et de communautés.",
  },
  Pisces: {
    punchline: "L'océan de l'âme, entre rêve et réalité.",
    aura: "Mystique, empathique et fluide.",
    atout: "Intuition et compassion",
    defi: "Les frontières et l'ancrage",
    amour: "Fusion spirituelle et romantisme onirique.",
    travail: "Créatif inspiré et guérisseur naturel.",
    social: "Éponge émotionnelle et confident universel.",
  },
};
