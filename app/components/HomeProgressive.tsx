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
import DailyCardStack from "./DailyCardStack";
import CardStack3D, { type Card3DData } from "./CardStack3D";
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
  const [firstNameInput, setFirstNameInput] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateInput, setBirthDateInput] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<GeocodingResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [ascendantSign, setAscendantSign] = useState<string | null>(null);
  const [ascendantSymbol, setAscendantSymbol] = useState<string | null>(null);
  const [ascendantColor, setAscendantColor] = useState<string>("#262626");

  // Compatibility teaser
  const [compatName1, setCompatName1] = useState("");
  const [compatName2, setCompatName2] = useState("");
  const [compatName1Input, setCompatName1Input] = useState("");
  const [compatName2Input, setCompatName2Input] = useState("");

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

  const handleFirstNameValidate = () => {
    setFirstName(firstNameInput.trim());
  };

  const handleBirthDateValidate = () => {
    setBirthDate(birthDateInput);
  };

  const handleCompatibilityValidate = () => {
    setCompatName1(compatName1Input.trim());
    setCompatName2(compatName2Input.trim());
  };

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
      setAscendantColor(ASTRO_COLORS[elementKey] ?? "#262626");
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
    <div className="fv-page space-y-24">

      {/* ═══════════════════════════════════════════════════════
          HERO ORACLE — "Pose ta question. Découvre la vérité."
      ════════════════════════════════════════════════════════ */}
      <HeroOracle />

      {/* ═══════════════════════════════════════════════════════
          §1 — HERO + Oracle du jour
          Same layout as DailyVibrationCombined's hero section
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <DottedSurface className="absolute inset-0 -z-10 opacity-30 blur-[0.2px]" ariaHidden />
        <div className="relative z-10 mx-auto max-w-5xl">

          {/* Date label */}
          <motion.p {...fadeIn(0)} className="fv-kicker text-xs text-[#262626]/70">
            Aujourd&apos;hui
          </motion.p>

          {/* Big Playfair date — same as DailyVibrationCombined */}
          <motion.h1
            {...fadeUp(0.1)}
            className="fv-title mt-4 text-[#262626]"
            style={{ fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)" }}
          >
            {todayLabel}
          </motion.h1>

          {/* Vibration sub-line */}
          <motion.p {...fadeIn(0.2)} className="fv-muted mt-6 text-base font-light">
            Vibration du jour :{" "}
            <span className="font-medium text-[#262626]">{initialDayOracle.vibration}</span>{" "}
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
            className="fv-divider mx-auto mt-10 w-24"
          />

          {/* 3D Card Stack — replaces grid */}
          <DailyCardStack dayOracle={initialDayOracle} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §2 — TON PRÉNOM
      ════════════════════════════════════════════════════════ */}
      <section className="space-y-8 px-8 py-16">
        <div className="mx-auto max-w-5xl space-y-8">

          <div className="space-y-2 text-center">
            <motion.p {...fadeIn(0)} className="fv-kicker text-xs text-[#262626]/70">
              On rentre à toi...
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} className="fv-title text-3xl font-medium text-[#262626]">
              Quel est ton prénom ?
            </motion.h2>
            <motion.p {...fadeIn(0.2)} className="fv-muted text-sm">
              Pour calculer la vibration de ton nom et personnaliser l&apos;Oracle.
            </motion.p>
          </div>

          {/* Input card */}
          <motion.div {...fadeUp(0.3)} className="fv-card mx-auto max-w-sm p-6 text-left">
            <p className="fv-kicker text-xs text-[#262626]/70">Ton prénom</p>
            <input
              type="text"
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
              placeholder="Marie, Luc, Amira…"
              className="fv-input mt-3 w-full border-b bg-transparent pb-3 text-xl placeholder:text-[#1A1A1A]/25 focus:border-[#262626] focus:outline-none transition-colors"
              autoComplete="given-name"
            />
            <button
              type="button"
              onClick={handleFirstNameValidate}
              className="fv-btn-primary mt-5 inline-flex w-full items-center justify-center rounded-sm text-xs"
            >
              Valider le prénom
            </button>
          </motion.div>

          {/* Vibration result — 3D card stack appears when name is typed */}
          <AnimatePresence>
            {nameVib > 0 && (
              <motion.div
                key="name-vib-stack"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <CardStack3D
                  cards={[
                    {
                      id: "vibration",
                      kicker: `Vibration · ${nameVib}`,
                      content: (
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                          <p className="fv-title text-5xl sm:text-6xl font-semibold text-[#262626] mb-4">
                            {nameVib}
                          </p>
                          <h3 className="fv-title text-2xl sm:text-3xl font-medium text-[#262626] mb-3">
                            {nameTitle}
                          </h3>
                          <p className="text-sm font-medium uppercase tracking-wider text-[#262626]/60">
                            {nameKeyword}
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "revelation",
                      kicker: "Ce que cela révèle",
                      content: (
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-lg sm:text-xl leading-relaxed text-[#262626]/80">
                            Le prénom <span className="font-medium">{debouncedFirstName}</span> porte une vibration{" "}
                            <span className="font-medium text-[#262626]">{nameVib}</span>. Chaque lettre contribue à
                            cette fréquence qui influence ton rapport au monde et ta façon de te manifester.
                          </p>
                        </div>
                      ),
                    },
                  ]}
                  showHint={true}
                  containerHeight="h-[420px] sm:h-[520px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §3 — TA DATE DE NAISSANCE (visible si prénom renseigné)
      ════════════════════════════════════════════════════════ */}
      <motion.section
        key="birth-date-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-10 px-8 py-16"
      >
            <div className="mx-auto max-w-5xl space-y-10">
              <div className="space-y-2 text-center">
                <p className="fv-kicker text-xs text-[#262626]/70">Étape 2</p>
                <h2 className="fv-title text-3xl font-medium text-[#262626]">
                  Ta résonance personnelle aujourd&apos;hui
                </h2>
                <p className="fv-muted mx-auto max-w-2xl text-sm leading-relaxed">
                  En reliant ta date de naissance à la vibration du jour, l&apos;Oracle compose une lecture qui te parle
                  directement, à ton rythme.
                </p>
              </div>

              <div className="mx-auto max-w-sm">
                <div className="fv-card p-6 text-left">
                  <p className="fv-kicker text-xs text-[#262626]/70">Date de naissance</p>
                  <input
                    type="date"
                    value={birthDateInput}
                    onChange={(e) => setBirthDateInput(e.target.value)}
                    className="fv-input mt-3 w-full border-b bg-transparent px-2 py-3 text-center text-base text-[#262626] outline-none focus:border-[#262626]"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <button
                    type="button"
                    onClick={handleBirthDateValidate}
                    className="fv-btn-primary mt-5 inline-flex w-full items-center justify-center rounded-sm text-xs"
                  >
                    Valider la date
                  </button>
                </div>
              </div>

              {/* 3D Card Stack — Oracle personnel + Message */}
              {personalOracle && lifePath !== null ? (
                <motion.div
                  key="personal-oracle-stack"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <CardStack3D
                    cards={[
                      {
                        id: "oracle-personnel",
                        kicker: "Oracle personnel",
                        content: (
                          <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <p className="fv-title text-5xl sm:text-6xl font-semibold text-[#262626] mb-4">
                              {personalOracle.vibration}
                            </p>
                            <h3 className="fv-title text-2xl sm:text-3xl font-medium text-[#262626] mb-2">
                              {personalOracle.title}
                            </h3>
                            <p className="text-xs uppercase tracking-[0.28em] text-[#262626]/50 mb-3">
                              Chemin de vie · {lifePath}
                            </p>
                            <p className="text-sm font-medium uppercase tracking-wider text-[#262626]/60">
                              {personalOracle.keyword}
                            </p>
                          </div>
                        ),
                      },
                      {
                        id: "ton-message",
                        kicker: "Ton message",
                        content: (
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-lg sm:text-xl leading-relaxed text-[#262626]/80">
                              {personalOracle.personalMessage}
                            </p>
                          </div>
                        ),
                      },
                    ]}
                    showHint={true}
                    containerHeight="h-[420px] sm:h-[520px]"
                  />
                </motion.div>
              ) : (
                <div className="fv-card p-6 text-center max-w-md mx-auto">
                  <p className="fv-muted text-sm leading-relaxed">
                    Entre ta date de naissance pour révéler ta résonance personnelle du jour.
                  </p>
                </div>
              )}

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
              <div className="space-y-2 text-center">
                <p className="fv-kicker text-xs text-[#262626]/70">Étape 3 · Optionnel</p>
                <h2 className="fv-title text-3xl font-medium text-[#262626]">
                  Ta ville de naissance
                </h2>
                <p className="fv-muted text-sm">Pour découvrir ton ascendant astrologique.</p>
              </div>

              <div className="mx-auto max-w-sm">
                <div className="fv-card p-6 text-left">
                  <p className="fv-kicker text-xs text-[#262626]/70">Ville de naissance</p>
                  <div className="relative mt-3">
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setAscendantSign(null);
                      }}
                      placeholder="Paris, Lyon, Casablanca…"
                      className="fv-input w-full border-b bg-transparent pb-3 text-center text-base placeholder:text-[#1A1A1A]/25 focus:border-[#262626] focus:outline-none transition-colors"
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
                              className="w-full px-4 py-3 text-left text-sm text-[#1A1A1A] hover:bg-[#F1F1EE] transition-colors"
                            >
                              {s.displayName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCityQuery((prev) => prev.trim())}
                    className="fv-btn-primary mt-5 inline-flex w-full items-center justify-center rounded-sm text-xs"
                  >
                    Valider la ville
                  </button>
                </div>
              </div>

              <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
                {/* Ascendant result card */}
                <div className="fv-card p-6 text-left">
                  <p className="fv-kicker text-xs text-[#262626]/70">Ascendant</p>
                  {ascendantSign && ascendantSymbol ? (
                    <div className="mt-3 flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl"
                        style={{ backgroundColor: `${ascendantColor}18`, color: ascendantColor }}
                      >
                        {ascendantSymbol}
                      </div>
                      <div>
                        <p className="fv-title text-2xl font-medium text-[#262626]">
                          {ascendantSign}
                        </p>
                        <Link
                          href="/mon-espace/astrologie"
                          className="mt-1 inline-block text-xs font-semibold text-[#262626] underline underline-offset-4 hover:text-[#111] transition-colors"
                        >
                          Voir mon thème complet →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="fv-muted mt-3 text-sm leading-relaxed">
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
                <p className="fv-kicker text-xs text-[#1A1A1A]/40">Oracle</p>
                <h2 className="fv-title text-3xl font-medium text-[#262626]">
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
              <div className="fv-card p-8">
                <p className="fv-kicker text-xs text-[#262626]">Ton espace</p>
                <h2 className="fv-title mt-3 text-2xl font-medium text-[#262626]">
                  Crée ton espace, {firstName}
                </h2>
                <p className="fv-muted mt-3 max-w-xl text-sm leading-relaxed">
                  Conserve tes tirages, accède à ton thème astral complet et retrouve ta résonance personnelle chaque jour.
                </p>
                <Link
                  href="/login"
                  className="fv-btn-primary mt-6 inline-flex items-center gap-2 rounded-sm text-sm shadow-sm transition"
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
      <section className="space-y-10 px-8 py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="space-y-2 text-center">
            <motion.p {...fadeIn(0)} className="fv-kicker text-xs text-[#262626]/70">
              Compatibilité
            </motion.p>
            <motion.h2 {...fadeUp(0.1)} className="fv-title text-3xl font-medium text-[#262626]">
              Vibrez-vous ensemble ?
            </motion.h2>
            <motion.p {...fadeIn(0.2)} className="fv-muted text-sm">
              Deux prénoms, une résonance vibratoire.
            </motion.p>
          </div>

          <div className="mx-auto max-w-sm">
            <motion.div {...fadeUp(0.3)} className="fv-card p-6 text-center">
              <p className="fv-kicker text-xs text-[#262626]/70">Deux prénoms</p>
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={compatName1Input}
                  onChange={(e) => setCompatName1Input(e.target.value)}
                  placeholder="Prénom 1"
                  className="fv-input w-full border-b bg-transparent pb-2 text-center text-base placeholder:text-[#1A1A1A]/25 focus:border-[#262626] focus:outline-none transition-colors"
                />
                <span className="block text-center text-lg text-[#1A1A1A]/20">♡</span>
                <input
                  type="text"
                  value={compatName2Input}
                  onChange={(e) => setCompatName2Input(e.target.value)}
                  placeholder="Prénom 2"
                  className="fv-input w-full border-b bg-transparent pb-2 text-center text-base placeholder:text-[#1A1A1A]/25 focus:border-[#262626] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleCompatibilityValidate}
                className="fv-btn-primary mt-5 inline-flex w-full items-center justify-center rounded-sm text-xs"
              >
                Valider les prénoms
              </button>
            </motion.div>
          </div>

          {/* 3D Card Stack — Résonance + Lecture */}
          {compatResult && compatResult.score > 0 ? (
            <motion.div
              key="compat-stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <CardStack3D
                cards={[
                  {
                    id: "resonance",
                    kicker: "Résonance",
                    content: (
                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <p className="text-xs uppercase tracking-[0.28em] text-[#262626]/70 mb-2">Nombre couple</p>
                        <p className="fv-title text-5xl sm:text-6xl font-semibold text-[#262626] mb-4">
                          {compatResult.coupleNumber}
                        </p>
                        <h3 className="fv-title text-xl sm:text-2xl font-medium text-[#262626] mb-6">
                          {compatResult.title}
                        </h3>
                        <div className="w-full max-w-xs">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E3DD]">
                            <div
                              className="h-full rounded-full bg-[#262626] transition-all duration-700"
                              style={{ width: `${compatResult.score * 10}%` }}
                            />
                          </div>
                          <p className="mt-2 text-right text-sm font-medium text-[#262626]/70">
                            {compatResult.score}/10
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "lecture",
                    kicker: "Lecture",
                    content: (
                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <p className="text-lg sm:text-xl leading-relaxed text-[#262626]/80 mb-6">
                          {compatResult.description}
                        </p>
                        <Link
                          href="/mon-espace/compatibilite"
                          className="inline-block text-sm font-semibold text-[#262626] underline underline-offset-4 hover:text-[#111] transition-colors"
                        >
                          Compatibilité des signes astraux →
                        </Link>
                      </div>
                    ),
                  },
                ]}
                showHint={true}
                containerHeight="h-[420px] sm:h-[520px]"
              />
            </motion.div>
          ) : (
            <div className="fv-card p-6 text-center max-w-md mx-auto">
              <p className="fv-muted text-sm leading-relaxed">
                Entre deux prénoms pour révéler votre score de compatibilité vibratoire.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          §8 — LES 4 PORTAILS
      ════════════════════════════════════════════════════════ */}
      <section className="space-y-12 px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center">
            <motion.h2 {...fadeUp(0)} className="fv-title text-4xl font-semibold text-[#262626] md:text-5xl">
              Quatre portes
            </motion.h2>
            <motion.p {...fadeIn(0.15)} className="fv-muted mt-4 text-sm">
              Chaque porte ouvre un angle différent de ta réalité
            </motion.p>
          </div>
          <div className="relative grid gap-6 md:grid-cols-2">
            {/* Decorative cross separator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block z-0">
              <div className="relative w-12 h-12">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E5E3DD]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E3DD]" />
              </div>
            </div>

            <PortalCard
              href="/comprendre"
              title="Comprendre"
              subtitle="Numérologie, cycles, archétypes et lignes de force de ton chemin."
              accentColor="#262626"
              romanNumeral="I"
              delay={0}
            />
            <PortalCard
              href="/aimer"
              title="Aimer"
              subtitle="Compatibilités, résonances de prénoms et signatures affectives."
              accentColor="#262626"
              romanNumeral="II"
              delay={100}
            />
            <PortalCard
              href="/prevoir"
              title="Prévoir"
              subtitle="Horoscopes, périodes charnières et fenêtres d&apos;opportunité."
              accentColor="#262626"
              romanNumeral="III"
              delay={200}
            />
            <PortalCard
              href="/recevoir"
              title="Recevoir"
              subtitle="Tirages intuitifs, messages symboliques et guidance en temps réel."
              accentColor="#262626"
              romanNumeral="IV"
              delay={300}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
