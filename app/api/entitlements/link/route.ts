import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { copyEntitlements } from "@/lib/entitlements/store";
import { getServerAuthSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { UID_COOKIE, LINKED_COOKIE, COOKIE_MAX_AGE } from "@/lib/constants";

export async function POST() {
  const session = await getServerAuthSession();
  const userEmail = (session?.user?.email || "").trim().toLowerCase();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const linked = (cookieStore.get(LINKED_COOKIE)?.value || "").trim() === "1";
  if (linked) {
    return NextResponse.json({ linked: true, migrated_count: 0 });
  }

  const fvUid = (cookieStore.get(UID_COOKIE)?.value || "").trim();
  if (!fvUid) {
    return NextResponse.json({ linked: false, migrated_count: 0 });
  }

  const migratedCount = await copyEntitlements(fvUid, userEmail);
  const res = NextResponse.json({ linked: true, migrated_count: migratedCount });
  res.cookies.set(LINKED_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
