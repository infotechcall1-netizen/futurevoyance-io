import { NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_IDS: Record<string, string> = {
  "shadow-mirror": "price_1SzPTDF768amoxL24h29xXS3",
  "decision-ab": "price_1SzPTDF768amoxL24h29xXS3",
  "next-step-love": "price_1SzPUeF768amoxL2xqMsj9y6",
  "abundance-key": "price_1SzPUeF768amoxL2xqMsj9y6",
};

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  let body: { module_id?: string } = {};
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

  const priceId = PRICE_IDS[module_id];
  if (!priceId) {
    return NextResponse.json(
      { error: "Unknown module_id" },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/modules/${module_id}?paid=1`,
      cancel_url: `${baseUrl}/modules/${module_id}?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
