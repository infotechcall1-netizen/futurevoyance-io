import { VertexAI } from "@google-cloud/vertexai";
import {
  loadGoogleServiceAccountCredentials,
} from "@/lib/oracle/credentials";
import prisma from "@/lib/prisma";
import type { MicroProduct } from "@/lib/microPurchases/catalog";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/* ── Lazy GCP credentials bootstrap ── */
let gcpCredentialsInitialized = false;

function ensureGCPCredentials() {
  if (gcpCredentialsInitialized) return;
  gcpCredentialsInitialized = true;

  const credentialsPath = (process.env.GOOGLE_APPLICATION_CREDENTIALS || "").trim();
  if (credentialsPath) return;

  try {
    const { credentials, sourceEnv } = loadGoogleServiceAccountCredentials();
    const tmpPath = path.join(os.tmpdir(), "gcp-sa-vertex.json");
    fs.writeFileSync(tmpPath, JSON.stringify(credentials), "utf-8");
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpPath;
    console.log("[micro-purchase] Bootstrapped GCP credentials from:", sourceEnv);
  } catch (err) {
    console.warn("[micro-purchase] Failed to bootstrap GCP credentials:", err instanceof Error ? err.message : String(err));
  }
}

/**
 * Generate micro-purchase content via Gemini.
 * Shared between checkout (subscriber free path) and generate endpoint (post-payment).
 */
export async function generateMicroContent(
  purchaseId: string,
  product: MicroProduct,
  userId: string
): Promise<string> {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) throw new Error("GOOGLE_CLOUD_PROJECT is not configured");

  const modelId = (process.env.GOOGLE_CLOUD_MODEL || "").trim() || "gemini-2.0-flash-001";
  const location = (process.env.GOOGLE_CLOUD_LOCATION || "").trim() || "us-central1";

  ensureGCPCredentials();

  // Load user profile for context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      birthDate: true,
      birthCity: true,
      birthTimezone: true,
    },
  });

  let userContext = "";
  if (user) {
    const parts: string[] = [];
    if (user.name) parts.push(`Prénom : ${user.name}`);
    if (user.birthDate) parts.push(`Date de naissance : ${user.birthDate}`);
    if (user.birthCity) parts.push(`Lieu de naissance : ${user.birthCity}`);
    userContext = parts.join("\n");
  }

  const systemPrompt = [
    "Tu es un oracle mystique bienveillant et expert en astrologie et numérologie.",
    "Tu génères du contenu riche, poétique et structuré en français.",
    "Tu ne donnes jamais de diagnostic médical, juridique ou financier.",
    "Réponds uniquement en texte structuré (pas de JSON).",
  ].join("\n");

  const userMessage = [
    product.generationPrompt,
    "",
    userContext ? `Profil de l'utilisateur :\n${userContext}` : "Aucun profil renseigné.",
  ].join("\n");

  const vertex = new VertexAI({ project, location });
  const model = vertex.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
    },
  });

  const result = await model.generateContent(userMessage);
  const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  const content = typeof text === "string" ? text : "";

  if (!content) {
    throw new Error("Gemini returned empty content");
  }

  // Save content to the purchase record
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { content },
  });

  return content;
}
