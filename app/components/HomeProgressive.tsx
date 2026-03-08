"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import HeroOracle from "./HeroOracle";
import MonthCalendar from "./MonthCalendar";
import DottedSurface from "./ui/DottedSurface";
import type { OracleVibration } from "../lib/oracle";

type HomeProgressiveProps = {
  initialDayOracle: OracleVibration;
};

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

/* ── Static decorative natal chart SVG ─────────────────────────── */
function DecorativeNatalWheel() {
  const signs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  const r = 120;
  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-64 w-64 sm:h-80 sm:w-80">
      <circle cx="150" cy="150" r={r} fill="none" stroke="#C9A961" strokeOpacity={0.3} strokeWidth={1.5} />
      <circle cx="150" cy="150" r={r - 24} fill="none" stroke="#C9A961" strokeOpacity={0.15} strokeWidth={1} />
      {signs.map((s, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const midAngle = ((i * 30 + 15) - 90) * (Math.PI / 180);
        const x1 = 150 + r * Math.cos(angle);
        const y1 = 150 + r * Math.sin(angle);
        const x2 = 150 + (r - 24) * Math.cos(angle);
        const y2 = 150 + (r - 24) * Math.sin(angle);
        const tx = 150 + (r - 12) * Math.cos(midAngle);
        const ty = 150 + (r - 12) * Math.sin(midAngle);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A961" strokeOpacity={0.2} strokeWidth={1} />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#C9A961" fillOpacity={0.5}>
              {s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function HomeProgressive({ initialDayOracle }: HomeProgressiveProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-80px" });

  const messageLines = initialDayOracle.dailyMessage.split(/\.\s+/).filter(Boolean);
  const visibleLines = messageLines.slice(0, 2).join(". ") + (messageLines.length > 2 ? "." : "");

  return (
    <div className="fv-page space-y-24">

      {/* ═══════ HERO ORACLE ═══════ */}
      <HeroOracle />

      {/* ═══════ §1 — VIBRATION DU JOUR ═══════ */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <DottedSurface className="absolute inset-0 -z-10 opacity-30 blur-[0.2px]" ariaHidden />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)}>
            <MonthCalendar />
          </motion.div>

          {/* Vibration number + title */}
          <motion.div {...fadeUp(0.15)} className="mt-10">
            <p className="text-5xl font-semibold text-[#262626]">{initialDayOracle.vibration}</p>
            <h2 className="fv-title mt-2 text-2xl font-medium text-[#262626]">{initialDayOracle.title}</h2>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-[#262626]/60">
              {initialDayOracle.keyword}
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="fv-divider mx-auto mt-8 w-24"
          />

          {/* Daily message — 2 lines clear, rest hidden */}
          <motion.div {...fadeIn(0.4)} className="mx-auto mt-8 max-w-xl text-left">
            <p className="fv-kicker mb-3 text-xs text-[#262626]/70">Message du jour</p>
            <p className="text-base leading-relaxed text-[#262626]/80">{visibleLines}</p>
            {messageLines.length > 2 && (
              <div className="relative mt-2">
                <p className="text-base leading-relaxed text-[#262626]/80 blur-[6px] select-none"
                   aria-hidden>
                  {messageLines.slice(2).join(". ")}.
                </p>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-[#FBFAF7]">
                  <Link href="/login" className="text-sm font-medium text-[#262626] underline underline-offset-4 hover:text-[#111] transition-colors">
                    Accède au message complet →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Daily ritual — fully blurred */}
          <motion.div {...fadeIn(0.5)} className="mx-auto mt-8 max-w-xl text-left">
            <p className="fv-kicker mb-3 text-xs text-[#262626]/70">Rituel du jour</p>
            <div className="relative">
              <p className="text-base leading-relaxed text-[#262626]/80 blur-[8px] select-none" aria-hidden>
                {initialDayOracle.dailyRitual}
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-sm bg-[#FBFAF7]/80 px-4 py-2 text-xs font-semibold text-[#262626]/70 backdrop-blur-sm">
                  Rituel du jour — Premium ✦
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ §2 — CARTE DU CIEL FLOUTÉE ═══════ */}
      <section ref={chartRef} className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={chartInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-lg"
        >
          <p className="fv-kicker text-xs text-[#262626]/70">Astrologie</p>
          <h2 className="fv-title mt-2 text-3xl font-medium text-[#262626]">
            Ta Carte du Ciel t&apos;attend
          </h2>

          <div className="relative mt-8">
            <div className="blur-[8px] select-none" aria-hidden>
              <DecorativeNatalWheel />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium text-[#262626]">
                Découvre ta signature astrale
              </p>
              <Link
                href="/login"
                className="fv-btn-primary inline-block rounded-sm px-6 py-3 text-sm font-medium shadow-sm transition-all"
              >
                Inscription gratuite →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ §3 — COMPATIBILITÉ PRÉ-REMPLIE ═══════ */}
      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <motion.p {...fadeIn(0)} className="fv-kicker text-xs text-[#262626]/70">
            Compatibilité
          </motion.p>
          <motion.h2 {...fadeUp(0.1)} className="fv-title mt-2 text-3xl font-medium text-[#262626]">
            Vibrez-vous ensemble ?
          </motion.h2>

          <motion.div {...fadeUp(0.25)} className="relative mt-8">
            <div className="fv-card p-6 blur-[4px] select-none" aria-hidden>
              <p className="text-lg text-[#262626]">Marie ♡ Paul</p>
              <p className="mt-3 text-4xl font-semibold text-[#262626]">4</p>
              <p className="mt-1 text-sm font-medium text-[#262626]/70">Couple Bâtisseur</p>
              <div className="mx-auto mt-4 max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E3DD]">
                  <div className="h-full w-[70%] rounded-full bg-[#262626]" />
                </div>
                <p className="mt-2 text-right text-sm font-medium text-[#262626]/70">7/10</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/login"
                className="fv-btn-primary inline-block rounded-sm px-6 py-3 text-sm font-medium shadow-sm transition-all"
              >
                Teste ta compatibilité →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ §4 — CTA INSCRIPTION FINAL ═══════ */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="fv-title text-3xl font-medium text-[#262626]">
            Crée ton espace ésotérique — c&apos;est gratuit
          </h2>
          <p className="fv-muted mt-4 text-sm leading-relaxed">
            Numérologie · Thème astral · Compatibilité · Oracle personnalisé
          </p>
          <Link
            href="/login"
            className="fv-btn-primary mt-8 inline-block rounded-sm px-8 py-4 text-base font-medium shadow-sm transition-all"
          >
            Commencer gratuitement →
          </Link>
        </div>
      </section>

    </div>
  );
}
