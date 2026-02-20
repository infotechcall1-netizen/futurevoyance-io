"use client";

import { useRef, useState } from "react";
import ShareCard, { exportSvgToPng } from "./ShareCard";
import SafetyBanner from "./SafetyBanner";
import { trackEvent } from "@/lib/analytics/track";
import type { PortalId } from "@/lib/oracle/schema";

const PORTALS = [
  { id: "comprendre" as const, label: "Comprendre" },
  { id: "aimer" as const, label: "Aimer" },
  { id: "prevoir" as const, label: "Prévoir" },
  { id: "recevoir" as const, label: "Recevoir" },
] as const;

type OracleContent = {
  essentiel: string;
  lecture: string[];
  action: string;
  share_card_text: string;
  archetype?: string;
  ombre?: string;
  initiation?: string;
  transmutation?: string;
  rituel?: string;
};

type OracleChatProps = {
  defaultPortalId?: PortalId;
  defaultModuleId?: string;
  lockPortal?: boolean;
  firstName?: string;
};

export default function OracleChat({
  defaultPortalId,
  defaultModuleId,
  lockPortal = false,
  firstName,
}: OracleChatProps = {}) {
  const isDev = process.env.NODE_ENV === "development";
  const [prompt, setPrompt] = useState("");
  const [portalId, setPortalId] = useState<PortalId>(defaultPortalId ?? "comprendre");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<OracleContent | null>(null);
  const [safety, setSafety] = useState<{
    category: string;
    disclaimer_key: string;
    referral_text: string | null;
  } | null>(null);
  const [rawJson, setRawJson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const moduleId = defaultModuleId ?? "vibe-check";
  const canSubmit = prompt.trim().length > 0 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setContent(null);
    setSafety(null);
    setRawJson(null);
    try {
      trackEvent("submit_oracle_question", {
        portal_id: portalId,
        module_id: moduleId,
      });
      const t0 = performance.now();
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          portal_id: portalId,
          module_id: moduleId,
        }),
      });
      const data = await res.json();
      setRawJson(JSON.stringify(data, null, 2));
      if (data?.content) {
        setContent({
          essentiel: data.content.essentiel ?? "",
          lecture: Array.isArray(data.content.lecture) ? data.content.lecture : [],
          action: data.content.action ?? "",
          share_card_text: data.content.share_card_text ?? "",
          archetype: data.content.archetype,
          ombre: data.content.ombre,
          initiation: data.content.initiation,
          transmutation: data.content.transmutation,
          rituel: data.content.rituel,
        });
        if (data?.safety && data.safety.category !== "none") {
          setSafety({
            category: data.safety.category,
            disclaimer_key: data.safety.disclaimer_key ?? "",
            referral_text: data.safety.referral_text ?? null,
          });
        } else {
          setSafety(null);
        }
        const latency_ms = Math.round(performance.now() - t0);
        const safety_category =
          typeof data?.safety?.category === "string"
            ? data.safety.category
            : "none";
        trackEvent("receive_oracle_insight", {
          portal_id: portalId,
          module_id: moduleId,
          latency_ms,
          safety_category,
        });

        // Save to history silently in background
        void fetch("/api/oracle/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            portal_id: portalId,
            prompt: prompt.trim(),
            response: data,
          }),
        }).catch((e) => console.error("[history_save_error]", e));
      } else {
        setError("Réponse invalide : pas de content.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10 bg-[#FBFAF7] px-8 py-16 md:px-16 md:py-20">
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A] md:text-4xl">
          Pose ta question
        </h2>
        <p className="mt-3 text-sm text-[#1A1A1A]/50">
          L'Oracle écoute
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
        {!lockPortal && (
          <div className="flex flex-wrap justify-center gap-3">
            {PORTALS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPortalId(p.id)}
                className={`rounded-sm px-5 py-2.5 text-sm font-medium transition-all ${
                  portalId === p.id
                    ? "bg-[#7C3AED] text-white"
                    : "border border-[#E5E3DD] bg-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={firstName ? `Pose ta question, ${firstName}…` : "Écris ton intention…"}
            className="w-full border-b border-[#E5E3DD] bg-transparent px-2 py-6 text-center text-lg text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#7C3AED] focus:outline-none"
            disabled={loading}
          />
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-10 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Consultation en cours..." : "Consulter"}
          </button>
        </div>
      </form>
      
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}
      
      {content && (
        <div className="mx-auto max-w-2xl space-y-8 border-t border-[#E5E3DD] pt-12">
          {safety && (
            <SafetyBanner
              category={safety.category}
              disclaimerKey={safety.disclaimer_key}
              referralText={safety.referral_text}
            />
          )}
          
          {content.archetype && content.ombre && content.initiation && content.transmutation && content.rituel && (
            <div className="rounded-sm border border-indigo-200/40 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 shadow-sm">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-900/70">
                Lecture initiatique
              </p>
              <div className="space-y-4 text-sm leading-relaxed">
                <div>
                  <span className="font-medium text-indigo-900">Archétype :</span>
                  <span className="ml-2 text-slate-700">{content.archetype}</span>
                </div>
                <div>
                  <span className="font-medium text-indigo-900">Ombre :</span>
                  <span className="ml-2 text-slate-700">{content.ombre}</span>
                </div>
                <div>
                  <span className="font-medium text-indigo-900">Initiation :</span>
                  <span className="ml-2 text-slate-700">{content.initiation}</span>
                </div>
                <div>
                  <span className="font-medium text-indigo-900">Transmutation :</span>
                  <span className="ml-2 text-slate-700">{content.transmutation}</span>
                </div>
                <div>
                  <span className="font-medium text-amber-800">Rituel :</span>
                  <span className="ml-2 text-slate-700">{content.rituel}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A961]">
                Essentiel
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#1A1A1A]">
                {content.essentiel}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A961]">
                Lecture
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#1A1A1A]/80">
                {content.lecture.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#7C3AED]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A961]">
                Action
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#1A1A1A]">
                {content.action}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={async () => {
                const svg = shareCardRef.current?.querySelector("svg");
                if (svg) {
                  try {
                    await exportSvgToPng(
                      svg as SVGSVGElement,
                      `futurevoyance-${portalId}-${Date.now()}.png`
                    );
                    trackEvent("generate_share_card", {
                      method: "download_png",
                      portal_id: portalId,
                      module_id: moduleId,
                    });
                  } catch {
                    setError("Export impossible.");
                  }
                }
              }}
              className="rounded-sm border border-[#C9A961]/40 bg-transparent px-6 py-3 text-sm font-medium text-[#C9A961] transition-all hover:border-[#C9A961]/60"
            >
              Télécharger ma carte
            </button>
          </div>
          
          <div
            ref={shareCardRef}
            className="pointer-events-none absolute left-[-9999px] top-0"
            aria-hidden
          >
            <ShareCard
              text={content.share_card_text}
              portalId={portalId}
              vibe={content.archetype}
            />
          </div>
        </div>
      )}
      {isDev && rawJson && (
        <details className="border-t border-[#E5E3DD] pt-3">
          <summary className="cursor-pointer text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A]">
            Debug (réponse JSON)
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-sm border border-[#E5E3DD] bg-white p-3 text-[11px] text-[#1A1A1A]/80">
            {rawJson}
          </pre>
        </details>
      )}
    </section>
  );
}
