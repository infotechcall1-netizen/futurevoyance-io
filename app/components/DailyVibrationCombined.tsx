"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { OracleVibration } from "../lib/oracle";
import { oraclePersonal } from "../lib/oracle";
import { trackEvent } from "@/lib/analytics/track";
import VibrationCalcBlock from "./VibrationCalcBlock";
import DottedSurface from "./ui/DottedSurface";

type Props = {
  todayLabel: string;
  initialDayOracle: OracleVibration;
};

export default function DailyVibrationCombined({ todayLabel, initialDayOracle }: Props) {
  const [dayOracle] = useState<OracleVibration>(initialDayOracle);
  const [isActivating, setIsActivating] = useState(false);

  const [birthDate, setBirthDate] = useState<string>("");
  const [personalOracle, setPersonalOracle] = useState<OracleVibration | null>(null);
  const [personalActivated, setPersonalActivated] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [birthError, setBirthError] = useState<string | null>(null);

  const handleActivatePersonal = () => {
    if (!birthDate) {
      setBirthError("Indique ta date de naissance pour activer ton Oracle personnel.");
      return;
    }
    setBirthError(null);

    // show brief loading animation / micro-interaction before revealing
    setIsActivating(true);
    const today = new Date();
    const oracle = oraclePersonal(today, birthDate);
    const delay = 800 + Math.floor(Math.random() * 401); // 800-1200ms
    setTimeout(() => {
      setPersonalOracle(oracle);
      setPersonalActivated(true);
      setShowPersonalDetails(false);
      setIsActivating(false);

      trackEvent("oracle_activate_personal", {
        vibration: oracle.vibration,
        keyword: oracle.keyword,
      });
    }, delay);
  };

  const handleRevealPersonal = () => {
    if (!personalOracle) return;
    setShowPersonalDetails(true);
    trackEvent("oracle_reveal_personal", {
      vibration: personalOracle.vibration,
      keyword: personalOracle.keyword,
    });
  };

  return (
    <div className="space-y-12">
      {/* Premium Spiritual Hero */}
      <section className="relative overflow-hidden px-6 py-20 text-center bg-gradient-to-b from-[#FBFAF7]/80 to-transparent">
        <DottedSurface className="absolute inset-0 -z-10 opacity-30 blur-[0.2px]" ariaHidden />
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Small subtle date label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-xs uppercase tracking-[0.35em] text-[#C9A961]/80"
          >
            Aujourd'hui
          </motion.p>

          {/* Main elegant date title */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="mt-4 font-[family-name:var(--font-playfair)] text-[#1A1A1A]"
            style={{ fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)" }}
          >
            {todayLabel}
          </motion.h1>

          {/* Vibration sub-line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-base font-light text-[#1A1A1A]/70"
          >
            Vibration du jour : <span className="font-medium text-[#7C3AED]">{dayOracle.vibration}</span> — {dayOracle.title}
          </motion.p>

          {/* Daily calc steps (only if present) */}
          {dayOracle.day_calc_steps && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <VibrationCalcBlock type="daily" steps={dayOracle.day_calc_steps} />
            </motion.div>
          )}

          {/* Subtle separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mt-10 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A961]/30 to-transparent"
          />

          {/* Three premium cards with stagger */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ambiance du jour</p>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                {dayOracle.title}
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/60">
                {dayOracle.keyword}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Message du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{dayOracle.dailyMessage}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Rituel du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{dayOracle.dailyRitual}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Short explanatory text between Day and Personal */}
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm text-[#1A1A1A]/70">
          Maintenant, découvre comment cette énergie résonne avec ton chemin personnel aujourd'hui.
        </p>
      </div>

      <section className="space-y-10 bg-[#FBFAF7] px-8 py-16">
        <div className="space-y-4 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
            Ta résonance personnelle aujourd'hui
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1A1A1A]/60">
            En reliant ta date de naissance à la vibration du jour, l'Oracle
            compose une lecture qui te parle directement, à ton rythme.
          </p>
        </div>

        {/* Three-card grid matching top section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Card 1: input + activate (placed inside first card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Date de naissance</p>
            <div className="mt-3">
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="mt-2 w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-center text-base text-[#1A1A1A] outline-none focus:border-[#7C3AED]"
              />

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={handleActivatePersonal}
                  disabled={isActivating}
                  className={`inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium text-white shadow-sm transition-all ${isActivating ? "bg-[#6D28D9]/70 cursor-wait" : "bg-[#7C3AED] hover:bg-[#6D28D9]"}`}
                >
                  <span>✨</span>
                  <span>{isActivating ? "Calcul de ta résonance..." : "Activer"}</span>
                </button>

                {personalActivated && personalOracle && !showPersonalDetails && (
                  <button
                    type="button"
                    onClick={handleRevealPersonal}
                    className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-sm border border-[#C9A961]/50 bg-transparent px-6 py-3 text-sm font-medium text-[#C9A961] transition-all hover:border-[#C9A961]/70"
                  >
                    <span>🔮</span>
                    <span>Révéler mon Oracle</span>
                  </button>
                )}
              </div>

              {birthError && (
                <p className="text-xs text-red-600 mt-3">{birthError}</p>
              )}
            </div>
          </motion.div>

          {/* Card 2: result number + title + keyword (Ambiance style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Oracle personnel</p>
            {personalActivated && personalOracle ? (
              <>
                <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#7C3AED]">
                  {personalOracle.vibration}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                  {personalOracle.title}
                </h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/60">
                  {personalOracle.keyword}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">Active ton Oracle pour révéler ta résonance personnelle du jour.</p>
            )}
          </motion.div>

          {/* Card 3: message & ritual (Rituel style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="rounded-md border border-[#E5E3DD] bg-white/60 p-6 text-left backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Rituel & Message</p>
            {personalActivated && personalOracle ? (
              showPersonalDetails ? (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{personalOracle.personalMessage}</p>
                  <div className="border-l-2 border-[#C9A961]/40 bg-white px-4 py-3 mt-4">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#C9A961]">Rituel à ancrer</p>
                    <p className="mt-2 text-sm text-[#1A1A1A]/80">{personalOracle.personalRitual}</p>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">Respire, centre-toi, puis clique sur « Révéler » quand tu es prêt·e.</p>
              )
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60">Ton message et ton rituel apparaîtront ici après activation.</p>
            )}
          </motion.div>
        </div>

        {/* Personal CALCUL block (centered, same width as top) */}
        {(personalOracle?.life_path_steps || personalOracle?.personal_resonance_steps) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          >
            <VibrationCalcBlock
              type="personal"
              lifePathSteps={personalOracle?.life_path_steps}
              resonanceSteps={personalOracle?.personal_resonance_steps}
            />
          </motion.div>
        )}

        {/* Explorer CTA (always shown when details revealed) */}
        {personalActivated && personalOracle && showPersonalDetails && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("oracle");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#6D28D9]"
            >
              Explorer le message complet de l'Oracle
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
