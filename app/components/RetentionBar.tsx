"use client";

import { useEffect, useState } from "react";
import { oracleOfDay } from "@/app/lib/oracle";

const DISMISSED_KEY = "fv_retention_bar_dismissed_until";

function getTimeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

export default function RetentionBar() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  // Compute tomorrow's oracle once (stable)
  const tomorrow = getTomorrow();
  const tomorrowOracle = oracleOfDay(tomorrow);

  useEffect(() => {
    // Check localStorage dismissal
    try {
      const until = localStorage.getItem(DISMISSED_KEY);
      if (until && Date.now() < parseInt(until, 10)) return;
    } catch { /* ignore */ }
    setVisible(true);

    // Update countdown every minute
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const dismiss = () => {
    try {
      const until = Date.now() + 12 * 60 * 60 * 1000; // 12h
      localStorage.setItem(DISMISSED_KEY, String(until));
    } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  const { hours, minutes } = countdown;
  const countdownStr =
    hours > 0
      ? `${hours}h ${String(minutes).padStart(2, "0")}min`
      : `${minutes} min`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "#262626", color: "#F5F0E8" }}
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
        {/* Left: countdown */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-60">Guidance</span>
          <span className="text-sm font-medium">
            Ta prochaine guidance dans{" "}
            <span style={{ color: "#C9A961" }}>{countdownStr}</span>
          </span>
        </div>

        {/* Center: teaser */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Demain</span>
          <span className="text-sm">
            <span style={{ color: "#C9A961" }} className="font-semibold">
              {tomorrowOracle.vibration}
            </span>
            {" — "}
            <span className="opacity-80">{tomorrowOracle.title}.</span>{" "}
            <span className="opacity-50 text-xs">Reviens pour ta guidance.</span>
          </span>
        </div>

        {/* Right: email button + close */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:guidance@futurevoyance.io?subject=Ma guidance quotidienne"
            className="rounded-sm border px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ borderColor: "rgba(201,169,97,0.5)", color: "#C9A961" }}
          >
            Recevoir par email
          </a>
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="text-base opacity-40 hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Mobile teaser (below main row) */}
      <div className="sm:hidden border-t border-white/10 px-5 py-2">
        <span className="text-xs opacity-60">Demain : </span>
        <span className="text-xs" style={{ color: "#C9A961" }}>
          {tomorrowOracle.vibration}
        </span>
        <span className="text-xs opacity-70">
          {" — "}{tomorrowOracle.title}. Reviens pour ta guidance.
        </span>
      </div>
    </div>
  );
}
