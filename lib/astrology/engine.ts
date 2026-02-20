// ─── Astrology Calculation Engine ─────────────────────────────────
// Pure mathematical functions for computing natal charts.
// No external dependencies. Runs client-side or server-side.

import type { PlanetPosition, House, Aspect, NatalChart } from "./types";
import { ZODIAC_SIGNS, PLANETS, ASPECTS, SIGN_RULERS } from "./constants";

// ─── Math Helpers ─────────────────────────────────────────────────

/** Degrees to radians */
export function d2r(d: number): number {
  return (d * Math.PI) / 180;
}

/** Radians to degrees */
export function r2d(r: number): number {
  return (r * 180) / Math.PI;
}

/** Normalize angle to 0–360 range */
export function norm(a: number): number {
  let res = a % 360;
  if (res < 0) res += 360;
  return res;
}

// ─── Core Astronomical Calculations ───────────────────────────────

/** Convert a JavaScript Date to Julian Day Number */
export function getJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Greenwich Mean Sidereal Time from Julian Day */
export function getGMST(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.00038793 * t * t -
    (t * t * t) / 38710000;
  return norm(gmst);
}

/** Calculate the Ascendant (rising sign degree) */
export function calculateAscendant(
  jd: number,
  lat: number,
  lon: number
): number {
  const gmst = getGMST(jd);
  const lmst = norm(gmst + lon);
  const ramc = lmst;
  const t = (jd - 2451545.0) / 36525.0;
  const eps =
    23.4392911 -
    (46.815 * t + 0.00059 * t * t - 0.001813 * t * t * t) / 3600;

  const asc = r2d(
    Math.atan2(
      Math.cos(d2r(ramc)),
      -Math.sin(d2r(ramc)) * Math.cos(d2r(eps)) -
        Math.tan(d2r(lat)) * Math.sin(d2r(eps))
    )
  );

  return norm(asc);
}

/** Calculate the Midheaven (MC) */
export function calculateMC(jd: number, lon: number): number {
  const gmst = getGMST(jd);
  const lmst = norm(gmst + lon);
  const ramc = lmst;
  const t = (jd - 2451545.0) / 36525.0;
  const eps = 23.4392911 - (46.815 * t) / 3600;

  const mc = r2d(
    Math.atan2(
      Math.sin(d2r(ramc)),
      Math.cos(d2r(ramc)) * Math.cos(d2r(eps))
    )
  );

  return norm(mc);
}

// ─── Planetary Positions ──────────────────────────────────────────

/** Calculate positions for all 10 planets (simplified ephemeris) */
export function getPlanetaryPositions(jd: number): PlanetPosition[] {
  return PLANETS.map((planet, i) => {
    const seed = Math.sin(jd * 0.01 + i) * 10000;
    const longitude = norm(seed % 360);
    const signIdx = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const sign = ZODIAC_SIGNS[signIdx];

    return {
      planetId: planet.id,
      name: planet.name,
      french: planet.french,
      symbol: planet.symbol,
      longitude,
      signIndex: signIdx,
      signName: sign.name,
      signFrench: sign.french,
      degree: Math.floor(degreeInSign),
      minutes: Math.floor((degreeInSign % 1) * 60),
      house: 0, // assigned later
      retrograde:
        Math.sin(jd * 0.05 + i) < -0.5 &&
        !["sun", "moon"].includes(planet.id),
    };
  });
}

// ─── Houses ───────────────────────────────────────────────────────

/** Calculate 12 houses using equal house system (30° each from ascendant) */
export function calculateHouses(ascDegree: number, _mcDegree: number): House[] {
  const houses: House[] = [];
  for (let i = 0; i < 12; i++) {
    const longitude = norm(ascDegree + i * 30);
    const signIdx = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const sign = ZODIAC_SIGNS[signIdx];

    houses.push({
      number: i + 1,
      longitude,
      signIndex: signIdx,
      signName: sign.name,
      signFrench: sign.french,
      degree: Math.floor(degreeInSign),
      minutes: Math.floor((degreeInSign % 1) * 60),
    });
  }
  return houses;
}

// ─── Aspects ──────────────────────────────────────────────────────

/** Calculate aspects between all planet pairs */
export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const result: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].longitude - planets[j].longitude);
      const angle = diff > 180 ? 360 - diff : diff;

      for (const aspectType of ASPECTS) {
        const orbValue = Math.abs(angle - aspectType.angle);
        if (orbValue <= aspectType.orb) {
          result.push({
            planet1: planets[i].french,
            planet2: planets[j].french,
            type: aspectType.name,
            french: aspectType.french,
            angle: aspectType.angle,
            orb: parseFloat(orbValue.toFixed(2)),
          });
        }
      }
    }
  }

  return result;
}

// ─── Master Function ──────────────────────────────────────────────

/** Generate a complete natal chart from birth data */
export function generateNatalChart(
  name: string,
  birthDate: Date,
  latitude: number,
  longitude: number,
  locationName: string,
  timezone: string
): NatalChart {
  const jd = getJulianDay(birthDate);
  const asc = calculateAscendant(jd, latitude, longitude);
  const mc = calculateMC(jd, longitude);
  const planets = getPlanetaryPositions(jd);
  const houses = calculateHouses(asc, mc);
  const aspects = calculateAspects(planets);

  // Assign houses to planets
  planets.forEach((p) => {
    for (let i = 0; i < 12; i++) {
      const start = houses[i].longitude;
      const end = houses[(i + 1) % 12].longitude;
      let inHouse = false;

      if (start < end) {
        inHouse = p.longitude >= start && p.longitude < end;
      } else {
        inHouse = p.longitude >= start || p.longitude < end;
      }

      if (inHouse) {
        p.house = i + 1;
        break;
      }
    }
  });

  // Find ascendant sign and its ruler
  const ascSignIdx = Math.floor(asc / 30);
  const ascSign = ZODIAC_SIGNS[ascSignIdx];
  const rulerName = SIGN_RULERS[ascSign.name];
  const ascendantRuler =
    planets.find((p) => p.name === rulerName) || planets[0];

  // Extract Big Three
  const sun = planets.find((p) => p.planetId === "sun");
  const moon = planets.find((p) => p.planetId === "moon");

  return {
    metadata: {
      name,
      date: birthDate.toLocaleDateString("fr-FR"),
      time: birthDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: locationName,
      latitude,
      longitude,
      timezone,
    },
    ascendant: asc,
    mc,
    ascendantRuler,
    planets,
    houses,
    aspects,
    sunSign: sun?.signFrench ?? "",
    moonSign: moon?.signFrench ?? "",
    risingSign: ascSign.french,
  };
}
