// ─── Astrology Engine Types ───────────────────────────────────────
// Pure TypeScript interfaces for the natal chart system.

/** Zodiac sign metadata */
export type ZodiacSign = {
  index: number;
  name: string;
  french: string;
  symbol: string;
  element: "Feu" | "Terre" | "Air" | "Eau";
  modality: "Cardinal" | "Fixe" | "Mutable";
};

/** Planet metadata */
export type Planet = {
  id: string;
  name: string;
  french: string;
  symbol: string;
};

/** A planet's computed position in a chart */
export type PlanetPosition = {
  planetId: string;
  name: string;
  french: string;
  symbol: string;
  longitude: number;
  signIndex: number;
  signName: string;
  signFrench: string;
  degree: number;
  minutes: number;
  house: number;
  retrograde: boolean;
};

/** Aspect type definition */
export type AspectType = {
  name: string;
  french: string;
  symbol: string;
  angle: number;
  orb: number;
};

/** A computed aspect between two planets */
export type Aspect = {
  planet1: string;
  planet2: string;
  type: string;
  french: string;
  angle: number;
  orb: number;
};

/** A house in the chart */
export type House = {
  number: number;
  longitude: number;
  signIndex: number;
  signName: string;
  signFrench: string;
  degree: number;
  minutes: number;
};

/** Ascendant interpretation template for a sign */
export type SignTemplate = {
  punchline: string;
  aura: string;
  amour: string;
  travail: string;
  social: string;
  atout: string;
  defi: string;
};

/** Chart metadata */
export type ChartMetadata = {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

/** Complete natal chart result */
export type NatalChart = {
  metadata: ChartMetadata;
  ascendant: number;
  mc: number;
  ascendantRuler: PlanetPosition;
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  sunSign: string;
  moonSign: string;
  risingSign: string;
};

/** Geocoding result from Nominatim */
export type GeocodingResult = {
  displayName: string;
  latitude: number;
  longitude: number;
};
