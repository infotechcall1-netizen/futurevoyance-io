"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { firstNameVibration, vibrationKeyword } from "@/lib/numerology";
import type { GeocodingResult } from "@/lib/astrology/types";

/* ── Types ── */
type Step = 0 | 1 | 2 | 3; // 0=prénom 1=date 2=ville 3=révélation

type CityOption = GeocodingResult;

/* ── Animations ── */
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4 } };
const slideLeft = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.35 },
};

/* ── Progress dots ── */
function ProgressDots({ current }: { current: Step }) {
  const total = 3;
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="inline-block h-2.5 w-2.5 rounded-full transition-colors duration-300"
          style={{
            background: i <= (current >= 3 ? 2 : current) ? "var(--fv-gold)" : "var(--fv-border)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Wizard ── */
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Revelation state
  const [vibration, setVibration] = useState(0);
  const [astroSignature, setAstroSignature] = useState<{ sun: string; moon: string; rising: string } | null>(null);

  /* ── City autocomplete ── */
  const searchCity = useCallback(async (q: string) => {
    if (q.length < 3) { setCityOptions([]); return; }
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", q);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "5");
      url.searchParams.set("accept-language", "fr");
      url.searchParams.set("addressdetails", "1");
      const res = await fetch(url.toString(), {
        headers: { "User-Agent": "FutureVoyance.io/1.0 (contact@futurevoyance.io)" },
      });
      if (!res.ok) return;
      const data = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
      setCityOptions(data.map((d) => ({
        displayName: d.display_name,
        latitude: parseFloat(d.lat),
        longitude: parseFloat(d.lon),
      })));
    } catch { /* ignore */ }
  }, []);

  const onCityInput = (value: string) => {
    setCityQuery(value);
    setSelectedCity(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCity(value), 400);
  };

  const selectCity = (c: CityOption) => {
    setSelectedCity(c);
    setCityQuery(c.displayName.split(",")[0]);
    setCityOptions([]);
  };

  /* ── Save data ── */
  const saveStep1 = async () => {
    if (!firstName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/birth-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim() }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      setStep(1);
    } catch {
      setError("Impossible de sauvegarder. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const saveStep2 = async () => {
    if (!birthDate) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/birth-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      setStep(2);
    } catch {
      setError("Impossible de sauvegarder. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const saveStep3 = async () => {
    if (!selectedCity) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/birth-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthCity: selectedCity.displayName.split(",")[0],
          birthLat: selectedCity.latitude,
          birthLon: selectedCity.longitude,
          birthTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      // Compute revelation
      const vib = firstNameVibration(firstName);
      setVibration(vib);
      // Compute astro signature client-side
      try {
        const { generateNatalChart } = await import("@/lib/astrology/engine");
        const chart = generateNatalChart(
          firstName,
          new Date(birthDate),
          selectedCity.latitude,
          selectedCity.longitude,
          selectedCity.displayName.split(",")[0],
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        setAstroSignature({ sun: chart.sunSign, moon: chart.moonSign, rising: chart.risingSign });
      } catch {
        // if chart fails, just show vibration
      }
      setStep(3);
    } catch {
      setError("Impossible de sauvegarder. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Keyboard enter ── */
  const onKey = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") { e.preventDefault(); action(); }
  };

  /* ── Close dropdown on click outside ── */
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCityOptions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "var(--fv-bg)" }}>
      <div className="w-full max-w-md px-6">
        {/* Progress */}
        {step < 3 && (
          <div className="mb-10">
            <ProgressDots current={step} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── Step 0: Prénom ─── */}
          {step === 0 && (
            <motion.div key="step-0" {...fadeIn} className="text-center">
              <h2 className="fv-title text-2xl md:text-3xl">Comment tu t&apos;appelles&nbsp;?</h2>
              <div className="mt-8">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => onKey(e, saveStep1)}
                  placeholder="Ton prénom"
                  autoFocus
                  className="fv-input w-full rounded-none border-b-2 bg-transparent px-2 py-3 text-center text-lg outline-none"
                  style={{ borderColor: "var(--fv-border)" }}
                />
              </div>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button
                onClick={saveStep1}
                disabled={!firstName.trim() || saving}
                className="fv-btn-primary mt-8 w-full disabled:opacity-40"
              >
                {saving ? "..." : "Continuer →"}
              </button>
            </motion.div>
          )}

          {/* ─── Step 1: Date ─── */}
          {step === 1 && (
            <motion.div key="step-1" {...slideLeft} className="text-center">
              <h2 className="fv-title text-2xl md:text-3xl">Quand es-tu né(e)&nbsp;?</h2>
              <div className="mt-8">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  onKeyDown={(e) => onKey(e, saveStep2)}
                  autoFocus
                  className="fv-input w-full rounded-none border-b-2 bg-transparent px-2 py-3 text-center text-lg outline-none"
                  style={{ borderColor: "var(--fv-border)" }}
                />
              </div>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button
                onClick={saveStep2}
                disabled={!birthDate || saving}
                className="fv-btn-primary mt-8 w-full disabled:opacity-40"
              >
                {saving ? "..." : "Continuer →"}
              </button>
            </motion.div>
          )}

          {/* ─── Step 2: Ville ─── */}
          {step === 2 && (
            <motion.div key="step-2" {...slideLeft} className="text-center">
              <h2 className="fv-title text-2xl md:text-3xl">Où es-tu né(e)&nbsp;?</h2>
              <div className="relative mt-8" ref={dropdownRef}>
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => onCityInput(e.target.value)}
                  onKeyDown={(e) => onKey(e, saveStep3)}
                  placeholder="Commence à taper ta ville…"
                  autoFocus
                  className="fv-input w-full rounded-none border-b-2 bg-transparent px-2 py-3 text-center text-lg outline-none"
                  style={{ borderColor: "var(--fv-border)" }}
                />
                {cityOptions.length > 0 && (
                  <ul
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto border shadow-lg"
                    style={{
                      background: "var(--fv-surface)",
                      borderColor: "var(--fv-border)",
                    }}
                  >
                    {cityOptions.map((c, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => selectCity(c)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:opacity-80"
                          style={{ color: "var(--fv-text)" }}
                        >
                          {c.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button
                onClick={saveStep3}
                disabled={!selectedCity || saving}
                className="fv-btn-primary mt-8 w-full disabled:opacity-40"
              >
                {saving ? "..." : "Découvrir mon profil →"}
              </button>
            </motion.div>
          )}

          {/* ─── Step 3: Révélation ─── */}
          {step === 3 && (
            <motion.div key="step-3" {...fadeIn} className="text-center">
              {/* Vibration flip card */}
              <motion.div
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-2xl border"
                style={{
                  background: "var(--fv-card)",
                  borderColor: "var(--fv-gold)",
                  perspective: "600px",
                }}
              >
                <div className="text-center">
                  <span className="block text-5xl font-bold" style={{ color: "var(--fv-gold)" }}>
                    {vibration}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.25em]" style={{ color: "var(--fv-muted)" }}>
                    {vibrationKeyword(vibration) || "Vibration"}
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="fv-kicker mb-2 text-xs"
              >
                Vibration de ton prénom
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="fv-title text-2xl md:text-3xl"
              >
                {firstName}
              </motion.h2>

              {/* Astro signature */}
              {astroSignature && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="mx-auto mt-8 max-w-xs"
                >
                  <p className="fv-kicker mb-4 text-xs">Ta signature astrale</p>
                  <div className="flex justify-center gap-6">
                    {[
                      { label: "Soleil", value: astroSignature.sun, symbol: "☉" },
                      { label: "Lune", value: astroSignature.moon, symbol: "☽" },
                      { label: "Ascendant", value: astroSignature.rising, symbol: "AC" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + i * 0.2, duration: 0.4 }}
                        className="text-center"
                      >
                        <span className="block text-xl" style={{ color: "var(--fv-gold)" }}>
                          {item.symbol}
                        </span>
                        <span className="mt-1 block text-sm font-medium" style={{ color: "var(--fv-text)" }}>
                          {item.value}
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--fv-muted)" }}>
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: astroSignature ? 2.2 : 1.2, duration: 0.4 }}
              >
                <button
                  onClick={() => router.push("/mon-espace")}
                  className="fv-btn-primary mt-10 w-full"
                >
                  Explorer mon espace →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
