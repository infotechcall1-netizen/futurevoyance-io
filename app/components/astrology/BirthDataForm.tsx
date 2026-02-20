"use client";

import { useState, useRef, useCallback } from "react";
import { geocodeCity } from "@/lib/astrology/geo";
import type { GeocodingResult } from "@/lib/astrology/types";

type BirthDataFormProps = {
  onSubmit: (data: {
    birthDate: string;
    birthTime: string;
    birthCity: string;
    latitude: number;
    longitude: number;
  }) => void;
  loading?: boolean;
};

export default function BirthDataForm({ onSubmit, loading }: BirthDataFormProps) {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCityInput = useCallback((value: string) => {
    setCityQuery(value);
    setSelectedCity(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await geocodeCity(value);
      setSuggestions(results);
      setSearching(false);
    }, 300);
  }, []);

  const handleSelectCity = (city: GeocodingResult) => {
    setSelectedCity(city);
    setCityQuery(city.displayName);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStr || !selectedCity) return;

    onSubmit({
      birthDate: dateStr,
      birthTime: unknownTime ? "12:00" : timeStr,
      birthCity: selectedCity.displayName,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
    });
  };

  const isValid = dateStr && selectedCity && (unknownTime || timeStr);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-8 backdrop-blur-sm">
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
          Formulaire Céleste
        </p>

        {/* Date de naissance */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            Date de naissance
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none"
            required
          />
        </div>

        {/* Heure de naissance */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            Heure de naissance
          </label>
          <input
            type="time"
            value={unknownTime ? "" : timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            disabled={unknownTime}
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none disabled:opacity-40"
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked);
                if (e.target.checked) setTimeStr("");
              }}
              className="size-4 rounded border-[#E5E3DD] text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            <span className="text-sm text-[#1A1A1A]/60">
              Heure inconnue (midi par défaut)
            </span>
          </label>
        </div>

        {/* Ville de naissance */}
        <div className="relative mt-6 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            Lieu de naissance
          </label>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => handleCityInput(e.target.value)}
            placeholder="Ville de naissance..."
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-base text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none"
            autoComplete="off"
          />

          {/* City suggestions dropdown */}
          {suggestions.length > 0 && !selectedCity && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-[#E5E3DD] bg-white shadow-lg">
              {suggestions.map((city, i) => (
                <button
                  key={`${city.latitude}-${city.longitude}-${i}`}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="block w-full px-4 py-3 text-left text-sm text-[#1A1A1A] transition hover:bg-[#FBFAF7]"
                >
                  {city.displayName}
                </button>
              ))}
            </div>
          )}

          {searching && (
            <p className="text-xs text-[#1A1A1A]/40">Recherche en cours...</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full rounded-sm bg-gradient-to-r from-[#4A1D5B] to-[#7C3AED] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Calcul en cours..." : "Révéler mon thème astral →"}
      </button>
    </form>
  );
}
