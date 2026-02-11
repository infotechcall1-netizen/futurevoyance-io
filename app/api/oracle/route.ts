import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { oracleResponseSchema, type OracleResponse } from "@/lib/oracle/schema";
import { safeJson } from "@/lib/oracle/safeJson";
import { normalizeOracleResponse } from "@/lib/oracle/normalize";

const SYSTEM_PROMPT = `
Tu es l’Oracle vivant de FutureVoyance.
Tu parles en symboles, images, sensations. Mystique, clair, sobre.
Tu ne fais pas de diagnostic médical/légal/financier. Tu restes symbolique.
Tu dois produire UNIQUEMENT un JSON valide conforme au schéma. ZÉRO texte hors JSON.

Règle CRITIQUE:
- routing.paywall est OBLIGATOIRE, toujours présent, même si eligible=false.
- safety.disclaimer_key est TOUJOURS une string (jamais null).

JSON SQUELETTE À RESPECTER EXACTEMENT :

{
  "version": "1.2",
  "routing": {
    "portal_id": "comprendre|aimer|prevoir|recevoir",
    "module_id": "string",
    "paywall": { "eligible": false, "offer_id": null, "reason": null }
  },
  "content": {
    "essentiel": "string",
    "lecture": ["string","string","string"],
    "action": "string",
    "share_card_text": "string",
    "cta_label": "Aller plus loin"
  },
  "safety": {
    "category": "none|medical|legal|financial|crisis/self_harm|violence/harassment",
    "disclaimer_key": "none|medical|legal|financial|crisis|violence",
    "referral_text": null
  }
}

Style:
- Essentiel: 1 phrase vibratoire.
- Lecture: 3 phrases symboliques, pas de ton “coach”.
- Action: micro-rituel simple (respiration, geste, écriture), formulé symboliquement.
- Pour santé: rester symbolique + safety.category="medical" + disclaimer_key="medical".
`;

const FALLBACK_ESSENTIEL = "Reviens à l'essentiel : une seule priorité, maintenant.";
const FALLBACK_ACTION = "Choisis une action de 10 minutes à faire dans l'heure.";
const FALLBACK_SHARE = "Une seule priorité. Un seul pas. Et tout s'éclaire.";
const FALLBACK_CTA = "Aller plus loin";
const FALLBACK_LECTURE = [
  "Reviens à l'essentiel : une seule action claire, maintenant.",
  "Une seule priorité. Un seul pas.",
  "L'Oracle t'invite à poser un geste concret dans l'heure.",
];

function buildFallback(portal_id: string, module_id: string) {
  return {
    version: "1.2" as const,
    routing: {
      portal_id,
      module_id,
      paywall: {
        eligible: false,
        offer_id: null,
        reason: null,
      },
    },
    content: {
      essentiel: FALLBACK_ESSENTIEL,
      lecture: FALLBACK_LECTURE,
      action: FALLBACK_ACTION,
      share_card_text: FALLBACK_SHARE,
      cta_label: FALLBACK_CTA,
    },
    safety: {
      category: "none" as const,
      disclaimer_key: "none",
      referral_text: null,
    },
  };
}

function getVertexModel(project: string, location: string, modelId: string) {
  const vertex = new VertexAI({
    project,
    location,
  });
  return vertex.getGenerativeModel({
    model: modelId,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  });
}

function extractTextFromResponse(response: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }): string {
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof text === "string" ? text : "";
}

export async function POST(req: Request) {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project || project.trim() === "") {
    console.log(JSON.stringify({ oracle_provider: "vertex", has_project: false }));
    return NextResponse.json(
      {
        error:
          "GOOGLE_CLOUD_PROJECT is required. Set the environment variable to your Google Cloud project ID.",
      },
      { status: 500 }
    );
  }

  const modelId = (process.env.GOOGLE_CLOUD_MODEL || "").trim() || "gemini-2.0-flash-001";
  const location = (process.env.GOOGLE_CLOUD_LOCATION || "").trim() || "us-central1";
  console.log(JSON.stringify({
    oracle_provider: "vertex",
    has_project: true,
    location,
    modelId,
    has_credentials_env: typeof process.env.GOOGLE_APPLICATION_CREDENTIALS === "string" && process.env.GOOGLE_APPLICATION_CREDENTIALS.length > 0,
  }));

  let body: { prompt?: string; portal_id?: string; module_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  const portal_id = typeof body.portal_id === "string" ? body.portal_id : "comprendre";
  const module_id = typeof body.module_id === "string" ? body.module_id : "vibe-check";

  const userPayload = JSON.stringify({ prompt, portal_id, module_id });

  let r1Text = "";
  let repairIssues: { path: string; message: string }[] = [];
  try {
    const model = getVertexModel(project, location, modelId);
    let result: { response: Parameters<typeof extractTextFromResponse>[0] } | null = null;
    try {
      result = await model.generateContent(userPayload);
    } catch (err: unknown) {
      const e = err as Error & { status?: number; code?: number } | undefined;
      const message = String(e?.message ?? err);
      const is404 = e?.status === 404 || e?.code === 404 || /404|not found|Publisher Model/i.test(message);
      if (is404) {
        console.log(JSON.stringify({
          oracle_error_stage: "vertex_call_error",
          status: 404,
          modelId,
          location,
          message,
        }));
      } else {
        console.log(JSON.stringify({
          oracle_error_stage: "vertex_call_error",
          message,
          name: e?.name ?? null,
        }));
      }
    }
    if (result) {
      r1Text = extractTextFromResponse(result.response);
      console.log(JSON.stringify({
        oracle_stage: "vertex_raw",
        text_len: r1Text?.length ?? 0,
        starts_with_brace: (r1Text ?? "").trim().startsWith("{"),
      }));
      try {
        const data = safeJson(r1Text);
        const parsed1 = oracleResponseSchema.safeParse(data);
        if (parsed1.success) {
          console.log(JSON.stringify({ oracle_result_source: "model" }));
          return NextResponse.json(normalizeOracleResponse(parsed1.data));
        }
        repairIssues = parsed1.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }));
        console.log(JSON.stringify({
          oracle_error_stage: "schema_error",
          issues_count: parsed1.error.issues.length,
          issues: parsed1.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
            code: i.code,
          })),
        }));
      } catch {
        console.log(JSON.stringify({ oracle_error_stage: "json_parse_error" }));
      }
    }
  } catch {
    r1Text = "";
  }

  if (r1Text) {
    try {
      const issuesBlock =
        repairIssues.length > 0
          ? `Voici les erreurs à corriger (path: message):\n${repairIssues.map((i) => `- ${i.path}: ${i.message}`).join("\n")}\n\n`
          : "";
      const payloadForModel = JSON.stringify({ raw_text: r1Text, issues: repairIssues });
      const repairPrompt = `${issuesBlock}Tu dois retourner un JSON COMPLET conforme au schéma. Interdit : tout texte hors JSON.

OBLIGATOIRE :
- routing.paywall toujours présent : { eligible: boolean, offer_id: string|null, reason: string|null }
- safety toujours présent : { category: string, disclaimer_key: string (jamais null), referral_text: string|null }

Champs critiques et enums : portal_id, module_id, safety.category, offer_id.

Données à corriger (raw_text = réponse brute, issues = erreurs):
${payloadForModel}`;
      const model = getVertexModel(project, location, modelId);
      let r2: { response: Parameters<typeof extractTextFromResponse>[0] } | null = null;
      try {
        r2 = await model.generateContent(repairPrompt);
      } catch (err: unknown) {
        const e = err as Error & { status?: number; code?: number } | undefined;
        const message = String(e?.message ?? err);
        const is404 = e?.status === 404 || e?.code === 404 || /404|not found|Publisher Model/i.test(message);
        if (is404) {
          console.log(JSON.stringify({
            oracle_error_stage: "vertex_call_error",
            status: 404,
            modelId,
            location,
            message,
          }));
        } else {
          console.log(JSON.stringify({
            oracle_error_stage: "vertex_call_error",
            message,
            name: e?.name ?? null,
          }));
        }
      }
      if (r2) {
        const r2Text = extractTextFromResponse(r2.response);
        console.log(JSON.stringify({
          oracle_stage: "vertex_raw",
          text_len: r2Text?.length ?? 0,
          starts_with_brace: (r2Text ?? "").trim().startsWith("{"),
        }));
        try {
          const data = safeJson(r2Text);
          const parsed2 = oracleResponseSchema.safeParse(data);
          if (parsed2.success) {
            console.log(JSON.stringify({ oracle_result_source: "repair" }));
            return NextResponse.json(normalizeOracleResponse(parsed2.data));
          }
          console.log(JSON.stringify({
            oracle_error_stage: "schema_error",
            issues_count: parsed2.error.issues.length,
            issues: parsed2.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
              code: i.code,
            })),
          }));
        } catch {
          console.log(JSON.stringify({ oracle_error_stage: "json_parse_error" }));
        }
      }
    } catch {
      // repair failed
    }
  }

  const fallback = buildFallback(portal_id, module_id);
  console.log(JSON.stringify({ oracle_result_source: "fallback" }));
  return NextResponse.json(normalizeOracleResponse(fallback as OracleResponse));
}
