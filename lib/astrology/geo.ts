// ─── Geocoding Service (Nominatim / OpenStreetMap) ────────────────
// Free geocoding for city search with autocomplete.

import type { GeocodingResult } from "./types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

/**
 * Search for cities by name using OpenStreetMap Nominatim.
 * Returns up to 5 results with French place names.
 *
 * Usage notes:
 * - Nominatim requires a User-Agent header
 * - Rate limit: max 1 request per second (debounce in the UI)
 * - Free, no API key needed
 */
export async function geocodeCity(
  query: string
): Promise<GeocodingResult[]> {
  if (query.length < 3) return [];

  try {
    const url = new URL(NOMINATIM_BASE);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5");
    url.searchParams.set("accept-language", "fr");
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "FutureVoyance.io/1.0 (contact@futurevoyance.io)",
      },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;

    return data.map((item) => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("[geocoding] Nominatim error:", error);
    return [];
  }
}
