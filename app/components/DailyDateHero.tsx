"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { OracleVibration } from "../lib/oracle";

type Props = {
  todayLabel: string;
  dayOracle: OracleVibration;
  showDayDetails: boolean;
  onRevealDay: () => void;
};

export default function DailyDateHero({ todayLabel, dayOracle, showDayDetails, onRevealDay }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-[#FBFAF7] px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: "easeOut" }}
        className="mx-auto max-w-5xl"
      >
        <p className="text-sm text-[#1A1A1A]/50">{todayLabel}</p>
        <h1
          className={`mt-4 font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl text-[#7C3AED] leading-tight transition-all duration-700 ${
            mounted ? "filter-none blur-0" : "blur-sm"
          }`}
        >
          {todayLabel}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9 }}
          className="mt-6 text-xl text-[#1A1A1A]"
        >
          Vibration du jour : <span className="font-bold">{dayOracle.vibration}</span> — {dayOracle.title}
        </motion.p>

        {!showDayDetails ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={onRevealDay}
              className="inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-8 py-4 text-base font-medium text-white shadow-md transition-all hover:bg-[#6D28D9] hover:shadow-lg"
            >
              <span>🔮</span>
              <span>Révéler le message</span>
            </button>
            <p className="mt-4 text-sm text-[#1A1A1A]/60">
              Ferme un instant les yeux, sens la couleur de ta journée…
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            <div className="rounded-md border border-[#E5E3DD] bg-white p-6 text-left shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Ambiance du jour</p>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-medium text-[#1A1A1A]">{dayOracle.title}</h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#7C3AED]/70">{dayOracle.keyword}</p>
            </div>

            <div className="rounded-md border border-[#E5E3DD] bg-white p-6 text-left shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Message du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{dayOracle.dailyMessage}</p>
            </div>

            <div className="rounded-md border border-[#E5E3DD] bg-white p-6 text-left shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A961]">Rituel du jour</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]">{dayOracle.dailyRitual}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
