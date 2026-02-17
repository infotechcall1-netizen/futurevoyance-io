import { redis } from "@/lib/redis";

const isProd = process.env.NODE_ENV === "production";
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const WEBHOOK_TTL_SECONDS = 60 * 60 * 24 * 7;

const processedEvents = new Map<string, true>();
let warnedDevFallback = false;

function warnDevFallbackOnce(): void {
  if (!warnedDevFallback) {
    warnedDevFallback = true;
    console.warn(
      "[stripe-idempotency] UPSTASH_* non configure, fallback memoire actif (dev only)."
    );
  }
}

export function webhookEventKey(eventId: string): string {
  return `fv:webhook:${eventId.trim()}`;
}

export async function markWebhookProcessed(eventId: string): Promise<boolean> {
  const normalizedEventId = eventId.trim();
  if (!normalizedEventId) {
    throw new Error("eventId is required");
  }

  const key = webhookEventKey(normalizedEventId);

  if (hasUpstash && redis) {
    const existing = await redis.get<string>(key);
    if (typeof existing === "string" && existing.length > 0) {
      return false;
    }
    await redis.set(key, "1", { ex: WEBHOOK_TTL_SECONDS });
    return true;
  }

  if (!isProd) {
    warnDevFallbackOnce();
    if (processedEvents.has(key)) return false;
    processedEvents.set(key, true);
    return true;
  }

  throw new Error("Stripe idempotency store is not configured in production");
}
