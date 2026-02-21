"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

type PortalCardProps = {
  href: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  accentColor?: string;
  romanNumeral?: string;
  delay?: number;
};

export default function PortalCard({
  href,
  title,
  subtitle,
  icon,
  accentColor = "#7C3AED",
  romanNumeral,
  delay = 0,
}: PortalCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      className="fv-card group relative flex min-h-[240px] flex-col justify-between border-l-2 px-8 py-10 overflow-hidden transition-all duration-300 hover:border-l-4 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderLeftColor: accentColor,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Roman numeral background */}
      {romanNumeral && (
        <div
          className="absolute bottom-4 right-4 font-display text-[8rem] leading-none pointer-events-none select-none"
          style={{ color: accentColor, opacity: 0.04 }}
        >
          {romanNumeral}
        </div>
      )}

      <div className="space-y-5 relative z-10">
        <h3 className="fv-title text-3xl font-semibold text-[#262626]">{title}</h3>
        <p className="fv-muted text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div
        className="mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 group-hover:gap-3 group-hover:translate-x-1 relative z-10"
        style={{ color: accentColor }}
      >
        <span>Entrer</span>
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
