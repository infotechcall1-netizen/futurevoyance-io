"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import OracleChat from "./OracleChat";
import PortalCard from "./PortalCard";
import type { OracleVibration } from "../lib/oracle";
import { oraclePersonal, lifePathFromDate } from "../lib/oracle";
import { firstNameVibration, vibrationKeyword, vibrationTitle, firstNameCompatibility } from "@/lib/numerology";
import { geocodeCity } from "@/lib/astrology/geo";
import { generateNatalChart } from "@/lib/astrology/engine";
import { ZODIAC_SIGNS, ASTRO_COLORS } from "@/lib/astrology/constants";
import type { GeocodingResult } from "@/lib/astrology/types";

type HomeProgressiveProps = {
  initialDayOracle: OracleVibration;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function HomeProgressive({ initialDayOracle }: HomeProgressiveProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // ── State ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<GeocodingResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [ascendantSign, setAscendantSign] = useState<string | null>(null);
  const [ascendantSymbol, setAscendantSymbol] = useState<string | null>(null);
  const [ascendantColor, setAscendantColor] = useState<string>(ASTRO_COLORS.gold);

  // Compatibility teaser
  const [compatName1, setCompatName1] = useState("");
  const [compatName2, setCompatName2] = useState("");

  // ── Derived values ──────────────────────────────────────────────────────
  const debouncedFirstName = useDebounce(firstName, 400);
  const debouncedCityQuery = useDebounce(cityQuery, 400);
  const debouncedCompatName1 = useDebounce(compatName1, 500);
  const debouncedCompatName2 = useDebounce(compatName2, 500);

  const nameVib = debouncedFirstName.length >= 2 ? firstNameVibration(debouncedFirstName) : 0;
  const nameKeyword = nameVib > 0 ? vibrationKeyword(nameVib) : "";
  const nameTitle = nameVib > 0 ? vibrationTitle(nameVib) : "";

  // Life path
  const [personalOracle, setPersonalOracle] = useState<OracleVibration | null>(null);
  const [lifePath, setLifePath] = useState<number | null>(null);

  useEffect(() => {
    if (!birthDate) {
      setPersonalOracle(null);
      setLifePath(null);
      return;
    }
    const today = new Date();
    const oracle = oraclePersonal(today, birthDate);
    setPersonalOracle(oracle);
    // parse birthDate (YYYY-MM-DD from <input type="date">)
    const [year, month, day] = birthDate.split("-").map(Number);
    const dateStr = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    const lp = lifePathFromDate(dateStr);
    setLifePath(lp.traditional);
  }, [birthDate]);

  // City geocoding
  const fetchCities = useCallback(async (query: string) => {
    if (query.length < 2) { setCitySuggestions([]); return; }
    setCityLoading(true);
    try {
      const results = await geocodeCity(query);
      setCitySuggestions(results);
    } catch {
      setCitySuggestions([]);
    } finally {
      setCityLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCities(debouncedCityQuery);
  }, [debouncedCityQuery, fetchCities]);

  const handleCitySelect = (result: GeocodingResult) => {
    setCityQuery(result.displayName.split(",")[0] || result.displayName);
    setCitySuggestions([]);
    if (!birthDate) return;
    // Calculate ascendant from birth data
    const [year, month, day] = birthDate.split("-").map(Number);
    const [h, m] = ["12", "00"].map(Number);
    const birthDt = new Date(year, month - 1, day, h, m);
    try {
      const chart = generateNatalChart("", birthDt, result.latitude, result.longitude, result.displayName, "UTC");
      const ascDeg = chart.ascendant;
      const signIdx = Math.floor(ascDeg / 30) % 12;
      const sign = ZODIAC_SIGNS[signIdx];
      setAscendantSign(sign.french);
      setAscendantSymbol(sign.symbol);
      const elementKey = sign.element as keyof typeof ASTRO_COLORS;
      setAscendantColor(ASTRO_COLORS[elementKey] ?? ASTRO_COLORS.gold);
    } catch {
      // silently ignore calculation errors
    }
  };

  // Compatibility teaser
  const compatResult =
    debouncedCompatName1.length >= 2 && debouncedCompatName2.length >= 2
      ? firstNameCompatibility(debouncedCompatName1, debouncedCompatName2)
      : null;

  // ── Today ───────────────────────────────────────────────────────────────
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-24">

      {/* §1 — Oracle du jour */}
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1A1A1A]/40">
            {todayLabel}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
            Vibration du jour
          </h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-l-2 border-[#C9A961] bg-[#FBFAF7] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A961]">
              Énergie · {initialDayOracle.vibration}
            </p>
            <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg font-medium text-[#1A1A1A]">
              {initialDayOracle.title}
            </p>
            <p className="mt-1 text-xs font-medium text-[#1A1A1A]/50">{initialDayOracle.keyword}</p>
          </div>
          <div className="sm:col-span-2 border border-[#E5E3DD] bg-[#FBFAF7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">Message</p>
            <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">
              {initialDayOracle.dailyMessage}
            </p>
          </div>
        </div>
      </section>

      {/* §2 — Ton prénom */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7C3AED]">Étape 1</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
            Quel est ton prénom ?
          </h2>
        </div>
        <div className="max-w-xs">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Marie, Luc, Amira…"
            className="w-full border-b-2 border-[#E5E3DD] bg-transparent pb-3 text-xl text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:border-[#7C3AED] focus:outline-none transition-colors"
            autoComplete="given-name"
          />
        </div>

        {nameVib > 0 && (
          <div className="flex items-center gap-4 border-l-2 border-[#7C3AED] pl-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
                Vibration · {nameVib}
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-playfair)] text-lg font-medium text-[#1A1A1A]">
                {nameTitle}
              </p>
              <p className="text-xs text-[#1A1A1A]/50">{nameKeyword}</p>
            </div>
          </div>
        )}
      </section>

      {/* §3 — Ta date de naissance (visible si prénom renseigné) */}
      {firstName.length >= 2 && (
        <section className="space-y-6 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7C3AED]">Étape 2</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
              Ta date de naissance
            </h2>
            <p className="text-sm text-[#1A1A1A]/50">Pour calculer ton chemin de vie et ta résonance personnelle.</p>
          </div>
          <div className="max-w-xs">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none transition-colors"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {personalOracle && lifePath !== null && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-[#7C3AED] bg-[#FBFAF7] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
                  Chemin de vie · {lifePath}
                </p>
                <p className="mt-2 font-[family-name:var(--font-playfair)] text-lg font-medium text-[#1A1A1A]">
                  Résonance du jour · {personalOracle.vibration}
                </p>
                <p className="mt-1 text-xs font-medium text-[#1A1A1A]/50">{personalOracle.keyword}</p>
              </div>
              <div className="border border-[#E5E3DD] bg-[#FBFAF7] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">Ton message</p>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">
                  {personalOracle.personalMessage}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* §4 — Ta ville de naissance (visible si date renseignée) */}
      {birthDate && (
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
              Étape 3 · Optionnel
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
              Ta ville de naissance
            </h2>
            <p className="text-sm text-[#1A1A1A]/50">Pour découvrir ton ascendant astrologique.</p>
          </div>

          <div className="relative max-w-sm">
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => { setCityQuery(e.target.value); setAscendantSign(null); }}
              placeholder="Paris, Lyon, Casablanca…"
              className="w-full rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#C9A961] focus:outline-none transition-colors"
            />
            {cityLoading && (
              <span className="absolute right-3 top-3 text-xs text-[#1A1A1A]/30">…</span>
            )}
            {citySuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 rounded-sm border border-[#E5E3DD] bg-white shadow-md">
                {citySuggestions.slice(0, 5).map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleCitySelect(s)}
                      className="w-full px-4 py-3 text-left text-sm text-[#1A1A1A] hover:bg-[#FBFAF7] transition-colors"
                    >
                      {s.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {ascendantSign && ascendantSymbol && (
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: `${ascendantColor}15`, color: ascendantColor }}
              >
                {ascendantSymbol}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/40">
                  Ascendant
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                  {ascendantSign}
                </p>
              </div>
              <Link
                href="/mon-espace/astrologie"
                className="ml-auto text-xs font-semibold text-[#7C3AED] underline underline-offset-4 hover:text-[#6D28D9]"
              >
                Voir mon thème complet →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* §5 — Oracle IA (visible si prénom renseigné) */}
      {firstName.length >= 2 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1A1A1A]/40">Oracle</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
              {firstName ? `À toi, ${firstName}` : "Interroge l'Oracle"}
            </h2>
          </div>
          <div id="oracle-chat" className="mx-auto max-w-3xl">
            <OracleChat firstName={firstName} />
          </div>
        </section>
      )}

      {/* §6 — Créer ton espace (si non-connecté et prénom renseigné) */}
      {firstName.length >= 2 && !isAuthenticated && (
        <section className="border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-6 py-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
            Crée ton espace, {firstName}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/60">
            Conserve tes tirages, accède à ton thème astral complet et retrouve ta résonance personnelle chaque jour.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-sm bg-[#7C3AED] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9]"
          >
            Créer mon espace gratuitement →
          </Link>
        </section>
      )}

      {/* §7 — Compatibilité teaser */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#DB2777]">Compatibilité</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
            Vibrez-vous ensemble ?
          </h2>
          <p className="text-sm text-[#1A1A1A]/50">Deux prénoms, une résonance.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={compatName1}
            onChange={(e) => setCompatName1(e.target.value)}
            placeholder="Prénom 1"
            className="w-36 rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#DB2777] focus:outline-none transition-colors"
          />
          <span className="flex items-center text-[#1A1A1A]/30 text-lg">♡</span>
          <input
            type="text"
            value={compatName2}
            onChange={(e) => setCompatName2(e.target.value)}
            placeholder="Prénom 2"
            className="w-36 rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-sm text-[#1A1A1A] focus:border-[#DB2777] focus:outline-none transition-colors"
          />
        </div>

        {compatResult && compatResult.score > 0 && (
          <div className="max-w-md space-y-3 border-l-2 border-[#DB2777] pl-4">
            <div className="flex items-center gap-3">
              {/* Score bar */}
              <div className="h-2 w-32 overflow-hidden rounded-full bg-[#E5E3DD]">
                <div
                  className="h-full rounded-full bg-[#DB2777] transition-all duration-500"
                  style={{ width: `${compatResult.score * 10}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#DB2777]">{compatResult.score}/10</span>
            </div>
            <p className="font-[family-name:var(--font-playfair)] text-lg font-medium text-[#1A1A1A]">
              {compatResult.title}
            </p>
            <p className="text-sm leading-relaxed text-[#1A1A1A]/60">{compatResult.description}</p>
          </div>
        )}

        <Link
          href="/mon-espace/compatibilite"
          className="inline-block text-xs font-semibold text-[#DB2777] underline underline-offset-4 hover:text-[#BE185D]"
        >
          Compatibilité des signes astraux →
        </Link>
      </section>

      {/* §8 — Les 4 portails */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
            Quatre portes
          </h2>
          <p className="mt-3 text-sm text-[#1A1A1A]/50">
            Chaque porte ouvre un angle différent de ta réalité
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PortalCard
            href="/comprendre"
            title="Comprendre"
            subtitle="Numérologie, cycles, archétypes et lignes de force de ton chemin."
            accentColor="var(--comprendre)"
          />
          <PortalCard
            href="/aimer"
            title="Aimer"
            subtitle="Compatibilités, résonances de prénoms et signatures affectives."
            accentColor="var(--aimer)"
          />
          <PortalCard
            href="/prevoir"
            title="Prévoir"
            subtitle="Horoscopes, périodes charnières et fenêtres d'opportunité."
            accentColor="var(--prevoir)"
          />
          <PortalCard
            href="/recevoir"
            title="Recevoir"
            subtitle="Tirages intuitifs, messages symboliques et guidance en temps réel."
            accentColor="var(--recevoir)"
          />
        </div>
      </section>

    </div>
  );
}
