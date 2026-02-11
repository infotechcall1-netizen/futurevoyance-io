"use client";

import { useRef, useState } from "react";
import ShareCard, { exportSvgToPng } from "./ShareCard";
import SafetyBanner from "./SafetyBanner";
import { trackEvent } from "@/lib/analytics/track";

const PORTALS = [
  { id: "comprendre" as const, label: "Comprendre" },
  { id: "aimer" as const, label: "Aimer" },
  { id: "prevoir" as const, label: "Prévoir" },
  { id: "recevoir" as const, label: "Recevoir" },
] as const;

type PortalId = "comprendre" | "aimer" | "prevoir" | "recevoir";

type OracleContent = {
  essentiel: string;
  lecture: string[];
  action: string;
  share_card_text: string;
};

type OracleChatProps = {
  defaultPortalId?: PortalId;
  defaultModuleId?: string;
  lockPortal?: boolean;
};

export default function OracleChat({
  defaultPortalId,
  defaultModuleId,
  lockPortal = false,
}: OracleChatProps = {}) {
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
    <section className="space-y-4 rounded-2xl border border-violet-500/20 bg-slate-900/50 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200/90">
        Interroger l&apos;Oracle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!lockPortal && (
          <div className="flex flex-wrap gap-2">
            {PORTALS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPortalId(p.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  portalId === p.id
                    ? "bg-violet-500 text-slate-50"
                    : "border border-violet-500/40 bg-transparent text-violet-200/90 hover:bg-violet-500/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Pose ta question ou décris ton intention..."
            className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-slate-50 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-sm text-rose-300/90">{error}</p>
      )}
      {content && (
        <div className="space-y-4 border-t border-slate-700/70 pt-4">
          {safety && (
            <SafetyBanner
              category={safety.category}
              disclaimerKey={safety.disclaimer_key}
              referralText={safety.referral_text}
            />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              Essentiel
            </p>
            <p className="mt-1 text-sm text-slate-200/95">{content.essentiel}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              Lecture
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-200/95">
              {content.lecture.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              Action
            </p>
            <p className="mt-1 text-sm text-slate-200/95">{content.action}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
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
                    trackEvent("share", {
                      method: "download_png",
                      portal_id: portalId,
                      module_id: moduleId,
                    });
                  } catch {
                    setError("Export impossible.");
                  }
                }
              }}
              className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
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
            />
          </div>
        </div>
      )}
      {rawJson && (
        <details className="border-t border-slate-700/70 pt-3">
          <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300">
            Debug (réponse JSON)
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-slate-950/80 p-3 text-[11px] text-slate-300/90">
            {rawJson}
          </pre>
        </details>
      )}
    </section>
  );
}
