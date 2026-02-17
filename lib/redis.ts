import { Redis } from "@upstash/redis";

declare global {
    // eslint-disable-next-line no-var
    var __fvRedis: Redis | undefined;
}

export function getRedis(): Redis | null {
    const url =
        (process.env.UPSTASH_REDIS_REST_URL || "").trim() ||
        (process.env.UPSTASH_REDIS_URL || "").trim();
    const token =
        (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim() ||
        (process.env.UPSTASH_REDIS_TOKEN || "").trim();

    if (!url || !token) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Upstash Redis credentials are required in production");
        }
        console.warn("[redis] Missing UPSTASH_REDIS_REST_URL/TOKEN — Redis features disabled.");
        return null;
    }

    if (!global.__fvRedis) {
        global.__fvRedis = new Redis({ url, token });
    }
    return global.__fvRedis;
}

export const redis = getRedis();
