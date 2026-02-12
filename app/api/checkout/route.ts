import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { PRICING_CATALOG } from "@/lib/pricing/catalog";

export const runtime = "nodejs";

import { UID_COOKIE, COOKIE_MAX_AGE } from "@/lib/constants";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret, {
    apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
  });

  let body: { module_id?: string; fv_uid?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const module_id = typeof body.module_id === "string" ? body.module_id.trim() : "";
  if (!module_id) {
    return NextResponse.json(
      { error: "module_id is required" },
      { status: 400 }
    );
  }

  const pricing = PRICING_CATALOG[module_id];
  const priceId = pricing?.stripe_price_id;
  if (!priceId) {
    return NextResponse.json(
      { error: "Unknown module_id or no price configured" },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieUid = (cookieStore.get(UID_COOKIE)?.value || "").trim();
  const bodyUid = typeof body.fv_uid === "string" ? body.fv_uid.trim() : "";
  const fvUid = cookieUid || bodyUid || randomUUID();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: fvUid,
      metadata: { module_id, fv_uid: fvUid },
      success_url: `${baseUrl}/modules/${module_id}?paid=1`,
      cancel_url: `${baseUrl}/modules/${module_id}?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ url: session.url });
    if (!cookieUid) {
      res.cookies.set(UID_COOKIE, fvUid, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
