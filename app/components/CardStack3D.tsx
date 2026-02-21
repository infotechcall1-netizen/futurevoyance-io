"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export type Card3DData = {
  id: string;
  kicker: string;
  content: React.ReactNode;
};

type CardStack3DProps = {
  cards: Card3DData[];
  className?: string;
  showHint?: boolean;
  containerHeight?: string;
};

export default function CardStack3D({
  cards,
  className = "",
  showHint = true,
  containerHeight = "h-[520px] sm:h-[620px]",
}: CardStack3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCardStyle = (offset: number) => {
    if (offset === 0) {
      return "card-stack-1";
    } else if (offset === 1) {
      return "card-stack-2";
    } else {
      return "card-stack-3";
    }
  };

  const getOpacity = (offset: number) => {
    if (offset === 0) return 1;
    if (offset === 1) return 0.7;
    return 0.4;
  };

  const getZIndex = (offset: number) => {
    if (offset === 0) return 20;
    if (offset === 1) return 15;
    return 10;
  };

  if (cards.length === 0) return null;

  return (
    <div className={`relative w-full flex flex-col items-center ${className}`}>
      {/* Swipe hint */}
      {showHint && cards.length > 1 && (
        <div className="absolute top-0 flex items-center gap-3 text-[#262626]/40 opacity-60 pointer-events-none">
          <span className="material-symbols-outlined swipe-indicator text-xl">swipe</span>
          <span className="text-[10px] uppercase tracking-widest font-medium">
            Glisser pour naviguer
          </span>
        </div>
      )}

      {/* Card stack container */}
      <div
        className={`relative w-full max-w-[90%] sm:max-w-[480px] ${containerHeight} flex items-center justify-center card-stack-container ${
          showHint && cards.length > 1 ? "mt-12" : ""
        }`}
      >
        {/* Navigation buttons */}
        {cards.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-40 hidden lg:flex w-14 h-14 rounded-full border border-[#E5E3DD] bg-white/50 backdrop-blur-sm text-[#262626]/40 hover:text-[#262626] hover:border-[#262626]/30 transition-all items-center justify-center group shadow-sm"
              aria-label="Carte précédente"
            >
              <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">
                chevron_left
              </span>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-40 hidden lg:flex w-14 h-14 rounded-full border border-[#E5E3DD] bg-white/50 backdrop-blur-sm text-[#262626]/40 hover:text-[#262626] hover:border-[#262626]/30 transition-all items-center justify-center group shadow-sm"
              aria-label="Carte suivante"
            >
              <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </>
        )}

        {/* Cards */}
        <div
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {cards.map((card, index) => {
            const offset = (index - activeIndex + cards.length) % cards.length;
            const isActive = offset === 0;
            const stackClass = getCardStyle(offset);

            return (
              <motion.div
                key={card.id}
                className={`card-base ${stackClass} absolute inset-0 bg-white border border-[#E5E3DD] shadow-xl rounded-[2.5rem] p-8 sm:p-12 flex flex-col ${
                  isActive ? "pointer-events-auto" : "pointer-events-none"
                }`}
                initial={false}
                animate={{
                  opacity: getOpacity(offset),
                  zIndex: getZIndex(offset),
                }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#262626]/50 mb-6 sm:mb-8 font-semibold">
                  {card.kicker}
                </span>
                {card.content}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator */}
      {cards.length > 1 && (
        <div className="mt-8 flex items-center gap-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all ${
                index === activeIndex
                  ? "w-10 h-1.5 rounded-full bg-[#262626] shadow-sm"
                  : "w-2 h-2 rounded-full bg-[#262626]/20"
              }`}
              aria-label={`Aller à la carte ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
