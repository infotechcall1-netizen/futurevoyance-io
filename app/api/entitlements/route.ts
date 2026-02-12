import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isEntitled } from "@/lib/entitlements/store";
import { getServerAuthSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { UID_COOKIE, COOKIE_MAX_AGE } from "@/lib/constants";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const moduleId = (url.searchParams.get("module_id") || "").trim();
  if (!moduleId) {
    return NextResponse.json({ error: "module_id is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const existingUid = (cookieStore.get(UID_COOKIE)?.value || "").trim();
  const uid = existingUid || randomUUID();
  const session = await getServerAuthSession();
  const sessionEmail = (session?.user?.email || "").trim().toLowerCase();

  let entitled = false;
  if (sessionEmail) {
    entitled = await isEntitled(sessionEmail, moduleId);
  }
  if (!entitled) {
    entitled = await isEntitled(uid, moduleId);
  }
  const res = NextResponse.json({ entitled });

  if (!existingUid) {
    res.cookies.set(UID_COOKIE, uid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return res;
}
