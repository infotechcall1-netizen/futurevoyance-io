import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const PRODUCTION_CANONICAL_HOST = "www.futurevoyance.io";

function redirectToCanonicalAuthHost(req: Request) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const currentUrl = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const requestHost = req.headers.get("host");
  const activeHost =
    (forwardedHost || requestHost || currentUrl.host || "").split(",")[0].trim().toLowerCase();
  const hostWithoutPort = activeHost.split(":")[0];

  if (hostWithoutPort !== "futurevoyance.io") {
    return null;
  }

  currentUrl.hostname = PRODUCTION_CANONICAL_HOST;
  currentUrl.protocol = "https:";
  currentUrl.port = "";
  return NextResponse.redirect(currentUrl, 308);
}

function getHandler() {
  return NextAuth(getAuthOptions());
}

export async function GET(req: Request, ctx: unknown) {
  try {
    const canonicalRedirect = redirectToCanonicalAuthHost(req);
    if (canonicalRedirect) {
      return canonicalRedirect;
    }

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
    const canonicalRedirect = redirectToCanonicalAuthHost(req);
    if (canonicalRedirect) {
      return canonicalRedirect;
    }

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
