"use client";

import type { NatalChart } from "@/lib/astrology/types";
import { ZODIAC_SIGNS, ASTRO_COLORS } from "@/lib/astrology/constants";

type NatalChartWheelProps = {
  chart: NatalChart;
  size?: number;
  className?: string;
};

export default function NatalChartWheel({
  chart,
  size = 600,
  className = "",
}: NatalChartWheelProps) {
  const center = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.72;
  const signRadius = radius * 0.86;
  const planetRadius = radius * 0.62;
  const rotationOffset = 180 - chart.ascendant;

  const toCartesian = (angle: number, r: number) => {
    const rad = ((angle + rotationOffset) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center - r * Math.sin(rad),
    };
  };

  const getElementColor = (signIndex: number) => {
    const element = ZODIAC_SIGNS[signIndex].element;
    return ASTRO_COLORS[element];
  };

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[600px] rounded-full bg-[#FBFAF7] p-2 ${className}`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
        {/* ── Outer circle ── */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ASTRO_COLORS.gold}
          strokeWidth="0.5"
          opacity="0.3"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke={ASTRO_COLORS.gold}
          strokeWidth="0.5"
          opacity="0.2"
        />

        {/* ── Zodiac sign segments ── */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const midAngle = startAngle + 15;
          const pos = toCartesian(midAngle, signRadius);
          const startInner = toCartesian(startAngle, innerRadius);
          const startOuter = toCartesian(startAngle, radius);

          return (
            <g key={sign.name}>
              {/* Segment divider line */}
              <line
                x1={startInner.x}
                y1={startInner.y}
                x2={startOuter.x}
                y2={startOuter.y}
                stroke={ASTRO_COLORS.gold}
                strokeWidth="0.3"
                opacity="0.15"
              />
              {/* Sign symbol */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={getElementColor(i)}
                fontSize="20"
                opacity="0.7"
                className="select-none"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* ── House cusps ── */}
        {chart.houses.map((house, i) => {
          const posInner = toCartesian(house.longitude, innerRadius);
          const posOuter = toCartesian(house.longitude, radius);
          const isCardinal = i === 0 || i === 3 || i === 6 || i === 9;

          return (
            <line
              key={`house-${i}`}
              x1={posInner.x}
              y1={posInner.y}
              x2={posOuter.x}
              y2={posOuter.y}
              stroke={isCardinal ? ASTRO_COLORS.gold : ASTRO_COLORS.primary}
              strokeWidth={isCardinal ? 3 : 0.4}
              strokeOpacity={isCardinal ? 0.8 : 0.1}
            />
          );
        })}

        {/* ── Aspect lines ── */}
        <g opacity="0.35">
          {chart.aspects.map((aspect, i) => {
            const p1 = chart.planets.find((p) => p.french === aspect.planet1);
            const p2 = chart.planets.find((p) => p.french === aspect.planet2);
            if (!p1 || !p2) return null;

            const pos1 = toCartesian(p1.longitude, innerRadius * 0.9);
            const pos2 = toCartesian(p2.longitude, innerRadius * 0.9);

            let color: string = ASTRO_COLORS.gold;
            if (aspect.type === "Trine" || aspect.type === "Sextile") {
              color = ASTRO_COLORS.Terre;
            }
            if (aspect.type === "Square" || aspect.type === "Opposition") {
              color = ASTRO_COLORS.Feu;
            }

            return (
              <line
                key={`aspect-${i}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={color}
                strokeWidth={Math.max(0.4, 2 - aspect.orb * 0.3)}
                strokeOpacity={0.5}
              />
            );
          })}
        </g>

        {/* ── Planets ── */}
        {chart.planets.map((planet) => {
          const pos = toCartesian(planet.longitude, planetRadius);
          const isBig3 = ["sun", "moon"].includes(planet.planetId);
          const circleR = isBig3 ? 18 : 14;

          return (
            <g key={planet.planetId} className="group">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={circleR}
                fill="white"
                stroke={ASTRO_COLORS.gold}
                strokeWidth="1.5"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isBig3 ? ASTRO_COLORS.primary : "#6B7280"}
                fontSize={isBig3 ? "18" : "14"}
                fontWeight={isBig3 ? "bold" : "normal"}
                className="select-none"
              >
                {planet.symbol}
              </text>
              {/* Retrograde indicator */}
              {planet.retrograde && (
                <text
                  x={pos.x + circleR + 3}
                  y={pos.y - circleR + 3}
                  fill={ASTRO_COLORS.Feu}
                  fontSize="10"
                  fontWeight="bold"
                >
                  R
                </text>
              )}
            </g>
          );
        })}

        {/* ── Ascendant marker ── */}
        <line
          x1={center - radius - 15}
          y1={center}
          x2={center - innerRadius + 15}
          y2={center}
          stroke={ASTRO_COLORS.primary}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.2"
        />
        <text
          x={center - radius - 25}
          y={center + 5}
          fill={ASTRO_COLORS.primary}
          fontSize="11"
          fontWeight="bold"
          textAnchor="end"
          letterSpacing="0.15em"
        >
          ASC
        </text>
      </svg>
    </div>
  );
}
