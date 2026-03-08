import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { canAccessPremium } from "@/lib/subscription";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerAuthSession();
  const subscribed = await canAccessPremium(session?.user?.email);
  return NextResponse.json({ subscribed });
}
