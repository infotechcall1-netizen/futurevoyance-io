"use client";

import { useState } from "react";

type VibrationDayCardProps = {
  vibration: number;
  title: string;
  keyword: string;
  message: string;
  ritual: string;
  isPremium: boolean;
};

export default function VibrationDayCard({
  vibration,
  title,
  keyword,
  message,
  ritual,
  isPremium,
}: VibrationDayCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Split message into visible first sentence + blurred rest for free teaser
  const sentenceEnd = message.search(/(?<=[.!?])\s/);
  const firstSentence = sentenceEnd > 0 ? message.slice(0, sentenceEnd + 1) : message;
  const restMessage = sentenceEnd > 0 ? message.slice(sentenceEnd + 1) : "";

  async function handleUpgrade() {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
    } catch {
      // noop
    } finally {
      setUpgradeLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
        Vibration du jour
      </p>

      {/* Number card */}
      <div className="border-l-2 border-[#C9A961] bg-[#FBFAF7] p-6">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#C9A961]/10">
            <span className="text-5xl font-semibold text-[#C9A961]">{vibration}</span>
          </div>
          <div className="space-y-2 pt-2">
            <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
              {title}
            </p>
            <span className="inline-block rounded-sm bg-[#C9A961]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A961]">
              {keyword}
            </span>
          </div>
        </div>
      </div>

      {/* Message + Ritual — premium: expandable; free: partial blur + CTA */}
      {isPremium ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/50 transition-colors hover:text-[#1A1A1A]/70"
          >
            <span className="text-[10px]">{expanded ? "▲" : "▼"}</span>
            <span>Message &amp; Rituel du jour</span>
          </button>

          {expanded && (
            <div className="space-y-3">
              <div className="border border-[#E5E3DD] bg-white/60 p-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                  Message
                </p>
                <p className="text-sm leading-relaxed text-[#1A1A1A]/80">{message}</p>
              </div>
              <div className="border-l-2 border-[#C9A961]/40 bg-[#FBFAF7] px-5 py-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A961]">
                  Rituel
                </p>
                <p className="text-sm leading-relaxed text-[#1A1A1A]/70">{ritual}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-[#E5E3DD] bg-white/60 p-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
              Message
            </p>
            {/* First sentence visible */}
            <p className="text-sm leading-relaxed text-[#1A1A1A]/80">{firstSentence}</p>
            {/* Rest blurred */}
            {restMessage && (
              <p className="mt-1 select-none text-sm leading-relaxed text-[#1A1A1A]/80 blur-sm">
                {restMessage}
              </p>
            )}
          </div>
          {/* Ritual fully blurred */}
          <div className="border-l-2 border-[#C9A961]/40 bg-[#FBFAF7] px-5 py-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A961]">
              Rituel
            </p>
            <p className="select-none text-sm leading-relaxed text-[#1A1A1A]/70 blur-sm">
              {ritual}
            </p>
          </div>
          {/* CTA */}
          <div className="flex items-center justify-between rounded-sm border border-dashed border-[#C9A961]/50 bg-[#FBFAF7] px-5 py-3">
            <p className="text-xs text-[#1A1A1A]/60">Message complet + Rituel</p>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="text-xs font-semibold text-[#C9A961] transition hover:opacity-70 disabled:opacity-50"
            >
              {upgradeLoading ? "…" : "→ Premium"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
