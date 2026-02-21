"use client";

import type { OracleVibration } from "../lib/oracle";
import CardStack3D, { type Card3DData } from "./CardStack3D";

type DailyCardStackProps = {
  dayOracle: OracleVibration;
};

export default function DailyCardStack({ dayOracle }: DailyCardStackProps) {
  const cards: Card3DData[] = [
    {
      id: "ambiance",
      kicker: "Ambiance du jour",
      content: (
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h3 className="font-display text-2xl sm:text-3xl mb-2 text-[#262626]">
            {dayOracle.title}
          </h3>
          <p className="text-xs tracking-[0.2em] uppercase text-[#262626]/70 font-semibold mt-4">
            {dayOracle.keyword}
          </p>
        </div>
      ),
    },
    {
      id: "message",
      kicker: "Message du jour",
      content: (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xl sm:text-2xl leading-relaxed text-[#262626]/80 font-serif italic">
            "{dayOracle.dailyMessage}"
          </p>
        </div>
      ),
    },
    {
      id: "ritual",
      kicker: "Rituel du jour",
      content: (
        <div className="flex-1 flex flex-col">
          <h2 className="font-display text-3xl sm:text-4xl mb-8 sm:mb-12 text-[#262626] leading-tight">
            Pratique Spirituelle
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-[#262626]/80 font-serif">
            {dayOracle.dailyRitual}
          </p>
        </div>
      ),
    },
  ];

  return <CardStack3D cards={cards} className="py-12 sm:py-16" />;
}
