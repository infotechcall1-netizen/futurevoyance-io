import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { getServerAuthSession } from "@/lib/auth";
import { UID_COOKIE } from "@/lib/constants";
import type { OracleResponse, PortalId } from "@/lib/oracle/schema";

export const runtime = "nodejs";

const HISTORY_MAX_ITEMS = 50;

function getUserHistoryKey(userKey: string): string {
    return `fv:history:${userKey.trim().toLowerCase()}`;
}

export async function GET(req: Request) {
    const session = await getServerAuthSession();
    const userEmail = session?.user?.email?.trim().toLowerCase();

    const cookieStore = await cookies();
    const uid = cookieStore.get(UID_COOKIE)?.value?.trim();

    const userKey = userEmail || uid;
    if (!userKey) {
        return NextResponse.json({ history: [] });
    }

    try {
        const key = getUserHistoryKey(userKey);
        const data = await redis.lrange(key, 0, HISTORY_MAX_ITEMS - 1);

        const history = data.map((item) => {
            try {
                return typeof item === "string" ? JSON.parse(item) : item;
            } catch {
                return null;
            }
        }).filter(Boolean);

        return NextResponse.json({ history });
    } catch (error) {
        console.error("[history_api_get] Error:", error);
        return NextResponse.json({ history: [], error: "Failed to fetch history" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerAuthSession();
    const userEmail = session?.user?.email?.trim().toLowerCase();

    const cookieStore = await cookies();
    const uid = cookieStore.get(UID_COOKIE)?.value?.trim();

    const userKey = userEmail || uid;
    if (!userKey) {
        return NextResponse.json({ error: "No user identification found" }, { status: 401 });
    }

    try {
        const body = await req.json() as {
            portal_id: PortalId;
            prompt: string;
            response: OracleResponse;
        };

        if (!body.response || !body.portal_id) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        const historyItem = {
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            portal_id: body.portal_id,
            prompt: body.prompt,
            response: body.response,
        };

        const key = getUserHistoryKey(userKey);

        // Save to Redis: push to front, trim to max, set expiry if it's an anonymous user
        const pipeline = redis.pipeline();
        pipeline.lpush(key, JSON.stringify(historyItem));
        pipeline.ltrim(key, 0, HISTORY_MAX_ITEMS - 1);

        // If it's an anonymous user (UID), set a TTL (e.g., 30 days) to avoid orphan data
        if (!userEmail) {
            pipeline.expire(key, 60 * 60 * 24 * 30);
        }

        await pipeline.exec();

        return NextResponse.json({ success: true, id: historyItem.id });
    } catch (error) {
        console.error("[history_api_post] Error:", error);
        return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
    }
}
