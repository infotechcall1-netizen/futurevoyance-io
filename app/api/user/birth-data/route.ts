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
      birthDate: true,
      birthCity: true,
      birthLat: true,
      birthLon: true,
      birthTimezone: true,
    },
  });

  return NextResponse.json({ birthData: user });
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json()) as {
    birthDate: string;
    birthCity: string;
    birthLat: number;
    birthLon: number;
    birthTimezone: string;
  };

  // Validate date
  const date = new Date(body.birthDate);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  // Validate coordinates
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

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      birthDate: date,
      birthCity: body.birthCity,
      birthLat: body.birthLat,
      birthLon: body.birthLon,
      birthTimezone: body.birthTimezone || "UTC",
    },
  });

  return NextResponse.json({ success: true });
}
