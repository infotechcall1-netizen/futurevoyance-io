import { Redis } from "@upstash/redis";

declare global {
    // eslint-disable-next-line no-var
    var __fvRedis: Redis | undefined;
}

export function getRedis(): Redis {
    const url =
        (process.env.UPSTASH_REDIS_URL || "").trim() ||
        (process.env.UPSTASH_REDIS_REST_URL || "").trim();
    const token =
        (process.env.UPSTASH_REDIS_TOKEN || "").trim() ||
        (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();

    if (!url || !token) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Upstash Redis credentials are required in production");
        }
        // In dev, we might not have it yet, but the app shouldn't crash until it's used.
        console.warn("[redis] Missing UPSTASH_REDIS_URL/TOKEN. Redis features will fail.");
    }

    if (!global.__fvRedis) {
        global.__fvRedis = new Redis({
            url: url || "http://localhost:8080", // dummy for typing if missing in dev
            token: token || "dummy",
        });
    }
    return global.__fvRedis;
}

export const redis = getRedis();
