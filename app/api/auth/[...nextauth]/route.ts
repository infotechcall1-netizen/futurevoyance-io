import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getHandler() {
  return NextAuth(getAuthOptions());
}

export async function GET(req: Request, ctx: unknown) {
  try {
    const url = new URL(req.url);
    console.log("[NextAuth GET]", {
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams.entries()),
    });
    return await getHandler()(req, ctx as never);
  } catch (err) {
    console.error("[NextAuth GET Error]", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    const message = err instanceof Error ? err.message : "Auth configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: unknown) {
  try {
    const url = new URL(req.url);
    console.log("[NextAuth POST]", {
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams.entries()),
    });
    return await getHandler()(req, ctx as never);
  } catch (err) {
    console.error("[NextAuth POST Error]", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    const message = err instanceof Error ? err.message : "Auth configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
