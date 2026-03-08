// ─── Birth Data API Route ─────────────────────────────────────────
// GET: retrieve current user's birth data
// POST: save/update birth data for the current user

import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      firstName: true,
      birthDate: true,
      birthCity: true,
      birthLat: true,
      birthLon: true,
      birthTimezone: true,
    },
  });

  return NextResponse.json({
    birthData: user,
    needsOnboarding: !user?.firstName,
  });
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json()) as {
    firstName?: string;
    birthDate?: string;
    birthCity?: string;
    birthLat?: number;
    birthLon?: number;
    birthTimezone?: string;
  };

  // Build partial update
  const data: Record<string, unknown> = {};

  // Optional firstName
  if (typeof body.firstName === "string" && body.firstName.trim()) {
    data.firstName = body.firstName.trim();
  }

  // Optional birthDate
  if (body.birthDate) {
    const date = new Date(body.birthDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    data.birthDate = date;
  }

  // Optional city + coordinates (require all geo fields together)
  if (body.birthCity || body.birthLat !== undefined || body.birthLon !== undefined) {
    if (
      typeof body.birthLat !== "number" ||
      typeof body.birthLon !== "number" ||
      body.birthLat < -90 ||
      body.birthLat > 90 ||
      body.birthLon < -180 ||
      body.birthLon > 180
    ) {
      return NextResponse.json(
        { error: "Coordonnées invalides" },
        { status: 400 }
      );
    }
    data.birthCity = body.birthCity;
    data.birthLat = body.birthLat;
    data.birthLon = body.birthLon;
    data.birthTimezone = body.birthTimezone || "UTC";
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data,
  });

  return NextResponse.json({ success: true });
}
