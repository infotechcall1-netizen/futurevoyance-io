import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getHandler() {
  return NextAuth(getAuthOptions());
}

export async function GET(req: Request, ctx: unknown) {
  try {
    return await getHandler()(req, ctx as never);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: unknown) {
  try {
    return await getHandler()(req, ctx as never);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Auth configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
