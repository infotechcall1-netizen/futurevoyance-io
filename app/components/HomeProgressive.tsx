"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import OracleChat from "./OracleChat";
import HeroOracle from "./HeroOracle";
import PortalCard from "./PortalCard";
import VibrationCalcBlock from "./VibrationCalcBlock";
import DottedSurface from "./ui/DottedSurface";
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

// Shared animation preset — same as DailyVibrationCombined
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay, ease: "easeOut" as const },
});

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
    const [year, month, day] = birthDate.split("-").map(Number);
    const birthDt = new Date(year, month - 1, day, 12, 0);
    try {
      const chart = generateNatalChart("", birthDt, result.latitude, result.longitude, result.displayName, "UTC");
      const signIdx = Math.floor(chart.ascendant / 30) % 12;
      const sign = ZODIAC_SIGNS[signIdx];
      setAscendantSign(sign.french);
      setAscendantSymbol(sign.symbol);
      const elementKey = sign.element as keyof typeof ASTRO_COLORS;
      setAscendantColor(ASTRO_COLORS[elementKey] ?? ASTRO_COLORS.gold);
    } catch {
      // silently ignore
    }
  };

  // Compatibility teaser
  const compatResult =
    debouncedCompatName1.length >= 2 && debouncedCompatName2.length >= 2
      ? firstNameCompatibility(debouncedCompatName1, debouncedCompatName2)
      : null;

  // Today label
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-24">

      {/* ═══════════════════════════════════════════════════════
          HERO ORACLE — "Pose ta question. Découvre la vérité."
      ════════════════════════════════════════════════════════ */}
      <HeroOracle />

      {/* ═══════════════════════════════════════════════════════
          §1 — HERO + Oracle du jour
          Same layout as DailyVibrationCombined's hero section
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-20 text-center bg-gradient-to-b from-[#FBFAF7]/80 to-transparent">
        <DottedSurface className="absolute inset-0 -z-10 opacity-30 blur-[0.2px]" ariaHidden />
        <div className="relative z-10 mx-auto max-w-5xl">

          {/* Date label */}
          <motion.p {...fadeIn(0)} className="text-xs uppercase tracking-[0.35em] text-[#C9A961]/80">
            Aujourd&apos;hui
          </motion.p>

          {/* Big Playfair date — same as DailyVibrationCombined */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-4 font-[family-name:var(--font-playfair)] text-[#1A1A1A]"
            style={{ fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)" }}
          >
            {todayLabel}
          </motion.h1>

          {/* Vibration sub-line */}
          <motion.p {...fadeIn(0.2)} className="mt-6 text-base font-light text-[#1A1A1A]/70">
            Vibration du jour :{" "}
            <span className="font-medium text-[#7C3AED]">{initialDayOracle.vibration}</span>{" "}
            — {initialDayOracle.title}
          </motion.p>

          {/* Calc steps */}
          {initialDayOracle.day_calc_steps && (
            <motion.div {...fadeIn(0.3)}>
              <VibrationCalcBlock type="daily" steps={initialDayOracle.day_calc_steps} />
            </motion.div>
          )}

          {/* Gold separator — same as DailyVibrationCombined */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mt-10 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A961]/30 to-transparent"
          />

          {/* 3-card grid — same structure as DailyVibrationCombined */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <motion.div {...fadeUp(0.5)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ambiance du jour</p>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                {initialDayOracle.title}
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/60">
                {initialDayOracle.keyword}
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.6)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Message du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{initialDayOracle.dailyMessage}</p>
            </motion.div>

            <motion.div {...fadeUp(0.7)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Rituel du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{initialDayOracle.dailyRitual}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §2 — TON PRÉNOM
      ════════════════════════════════════════════════════════ */}
      <section className="space-y-8 bg-[#FBFAF7] px-8 py-16">
        <div className="mx-auto max-w-5xl space-y-8">

          <div className="space-y-2 text-center">
            <motion.p {...fadeIn(0)} className="text-xs uppercase tracking-[0.35em] text-[#7C3AED]/70">
              À toi
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
              Quel est ton prénom ?
            </motion.h2>
            <motion.p {...fadeIn(0.2)} className="text-sm text-[#1A1A1A]/50">
              Pour calculer la vibration de ton nom et personnaliser l&apos;Oracle.
            </motion.p>
          </div>

          {/* Input card */}
          <motion.div {...fadeUp(0.3)} className="mx-auto max-w-sm rounded-md border border-[#E5E3DD] bg-white/60 p-6 backdrop-blur-sm text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ton prénom</p>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Marie, Luc, Amira…"
              className="mt-3 w-full border-b border-[#E5E3DD] bg-transparent pb-3 text-xl text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:border-[#7C3AED] focus:outline-none transition-colors"
              autoComplete="given-name"
            />
          </motion.div>

          {/* Vibration result — appears when name is typed */}
          <AnimatePresence>
            {nameVib > 0 && (
              <motion.div
                key="name-vib"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-none md:grid-cols-3"
              >
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Vibration · {nameVib}</p>
                  <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#7C3AED]">
                    {nameVib}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                    {nameTitle}
                  </h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/60">
                    {nameKeyword}
                  </p>
                </div>

                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ce que cela révèle</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">
                    Le prénom <span className="font-medium">{debouncedFirstName}</span> porte une vibration{" "}
                    <span className="font-medium text-[#7C3AED]">{nameVib}</span>. Chaque lettre contribue à cette
                    fréquence qui influence ton rapport au monde et ta façon de te manifester.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §3 — TA DATE DE NAISSANCE (visible si prénom renseigné)
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {firstName.length >= 2 && (
          <motion.section
            key="birth-date-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-10 bg-[#FBFAF7] px-8 py-16"
          >
            <div className="mx-auto max-w-5xl space-y-10">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#7C3AED]/70">Étape 2</p>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
                  Ta résonance personnelle aujourd&apos;hui
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1A1A1A]/60">
                  En reliant ta date de naissance à la vibration du jour, l&apos;Oracle compose une lecture qui te parle
                  directement, à ton rythme.
                </p>
              </div>

              {/* 3-card grid — same as DailyVibrationCombined personal section */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1 — input */}
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Date de naissance</p>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-3 w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-center text-base text-[#1A1A1A] outline-none focus:border-[#7C3AED]"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Card 2 — chemin de vie + résonance */}
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Oracle personnel</p>
                  {personalOracle && lifePath !== null ? (
                    <>
                      <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#7C3AED]">
                        {personalOracle.vibration}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                        {personalOracle.title}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#1A1A1A]/50">
                        Chemin de vie · {lifePath}
                      </p>
                      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/60">
                        {personalOracle.keyword}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">
                      Entre ta date de naissance pour révéler ta résonance personnelle du jour.
                    </p>
                  )}
                </div>

                {/* Card 3 — message personnel */}
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ton message</p>
                  {personalOracle ? (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">
                      {personalOracle.personalMessage}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">
                      Ton message personnel apparaîtra ici.
                    </p>
                  )}
                </div>
              </div>

              {/* Life path calc block */}
              {personalOracle?.life_path_steps && (
                <motion.div {...fadeIn(0.2)}>
                  <VibrationCalcBlock
                    type="personal"
                    lifePathSteps={personalOracle.life_path_steps}
                    resonanceSteps={personalOracle.personal_resonance_steps}
                  />
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          §4 — TA VILLE DE NAISSANCE (visible si date renseignée)
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {birthDate && (
          <motion.section
            key="birth-city-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8 px-8"
          >
            <div className="mx-auto max-w-5xl space-y-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-[#C9A961]/80">Étape 3 · Optionnel</p>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
                  Ta ville de naissance
                </h2>
                <p className="text-sm text-[#1A1A1A]/50">Pour découvrir ton ascendant astrologique.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Input card */}
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ville de naissance</p>
                  <div className="relative mt-3">
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(e) => { setCityQuery(e.target.value); setAscendantSign(null); }}
                      placeholder="Paris, Lyon, Casablanca…"
                      className="w-full border-b border-[#E5E3DD] bg-transparent pb-3 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:border-[#C9A961] focus:outline-none transition-colors"
                    />
                    {cityLoading && (
                      <span className="absolute right-1 top-0 text-xs text-[#1A1A1A]/30">…</span>
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
                </div>

                {/* Ascendant result card */}
                <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ascendant</p>
                  {ascendantSign && ascendantSymbol ? (
                    <div className="mt-3 flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl"
                        style={{ backgroundColor: `${ascendantColor}18`, color: ascendantColor }}
                      >
                        {ascendantSymbol}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
                          {ascendantSign}
                        </p>
                        <Link
                          href="/mon-espace/astrologie"
                          className="mt-1 inline-block text-xs font-semibold text-[#7C3AED] underline underline-offset-4 hover:text-[#6D28D9] transition-colors"
                        >
                          Voir mon thème complet →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">
                      Entre ta ville de naissance pour découvrir ton signe ascendant.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          §5 — ORACLE IA (visible si prénom renseigné)
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {firstName.length >= 2 && (
          <motion.section
            key="oracle-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8 px-8"
          >
            <div className="mx-auto max-w-5xl space-y-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-[#1A1A1A]/40">Oracle</p>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
                  {firstName ? `À toi, ${firstName}` : "Interroge l'Oracle"}
                </h2>
              </div>
              <div id="oracle-chat" className="mx-auto max-w-3xl">
                <OracleChat firstName={firstName} />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          §6 — CRÉER TON ESPACE (si non-connecté et prénom renseigné)
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {firstName.length >= 2 && !isAuthenticated && (
          <motion.section
            key="cta-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="px-8"
          >
            <div className="mx-auto max-w-5xl">
              <div className="rounded-md border border-[#E5E3DD] bg-white/60 p-8 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-[#7C3AED]">Ton espace</p>
                <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">
                  Crée ton espace, {firstName}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#1A1A1A]/60">
                  Conserve tes tirages, accède à ton thème astral complet et retrouve ta résonance personnelle chaque jour.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-tl from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                >
                  Créer mon espace gratuitement →
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          §7 — COMPATIBILITÉ TEASER
      ════════════════════════════════════════════════════════ */}
      <section className="space-y-10 bg-[#FBFAF7] px-8 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-2 text-center">
            <motion.p {...fadeIn(0)} className="text-xs uppercase tracking-[0.35em] text-[#DB2777]/70">
              Compatibilité
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
              Vibrez-vous ensemble ?
            </motion.h2>
            <motion.p {...fadeIn(0.2)} className="text-sm text-[#1A1A1A]/50">
              Deux prénoms, une résonance vibratoire.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Input card */}
            <motion.div {...fadeUp(0.3)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Deux prénoms</p>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={compatName1}
                  onChange={(e) => setCompatName1(e.target.value)}
                  placeholder="Prénom 1"
                  className="w-full border-b border-[#E5E3DD] bg-transparent pb-2 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:border-[#DB2777] focus:outline-none transition-colors"
                />
                <span className="block text-center text-lg text-[#1A1A1A]/20">♡</span>
                <input
                  type="text"
                  value={compatName2}
                  onChange={(e) => setCompatName2(e.target.value)}
                  placeholder="Prénom 2"
                  className="w-full border-b border-[#E5E3DD] bg-transparent pb-2 text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:border-[#DB2777] focus:outline-none transition-colors"
                />
              </div>
            </motion.div>

            {/* Score card */}
            <motion.div {...fadeUp(0.4)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Résonance</p>
              {compatResult && compatResult.score > 0 ? (
                <>
                  <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#DB2777]">
                    {compatResult.score}<span className="text-lg text-[#1A1A1A]/40">/10</span>
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                    {compatResult.title}
                  </h3>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E3DD]">
                    <div
                      className="h-full rounded-full bg-[#DB2777] transition-all duration-700"
                      style={{ width: `${compatResult.score * 10}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">
                  Entre deux prénoms pour révéler votre score de compatibilité vibratoire.
                </p>
              )}
            </motion.div>

            {/* Description card */}
            <motion.div {...fadeUp(0.5)} className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Lecture</p>
              {compatResult && compatResult.score > 0 ? (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{compatResult.description}</p>
                  <Link
                    href="/mon-espace/compatibilite"
                    className="mt-4 inline-block text-xs font-semibold text-[#DB2777] underline underline-offset-4 hover:text-[#BE185D] transition-colors"
                  >
                    Compatibilité des signes astraux →
                  </Link>
                </>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">
                  Ta lecture vibratoire apparaîtra ici.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §8 — LES 4 PORTAILS
      ════════════════════════════════════════════════════════ */}
      <section className="space-y-12 px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center">
            <motion.h2 {...fadeUp(0)} className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[#1A1A1A] md:text-5xl">
              Quatre portes
            </motion.h2>
            <motion.p {...fadeIn(0.15)} className="mt-4 text-sm text-[#1A1A1A]/50">
              Chaque porte ouvre un angle différent de ta réalité
            </motion.p>
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
              subtitle="Horoscopes, périodes charnières et fenêtres d&apos;opportunité."
              accentColor="var(--prevoir)"
            />
            <PortalCard
              href="/recevoir"
              title="Recevoir"
              subtitle="Tirages intuitifs, messages symboliques et guidance en temps réel."
              accentColor="var(--recevoir)"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
