import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PREMIUM_PRICE_ID is not configured" },
      { status: 500 }
    );
  }

  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const stripe = new Stripe(secret, {
    apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
  });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, stripeCustomerId: true, subscriptionStatus: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Already subscribed
  if (user.subscriptionStatus === "active") {
    return NextResponse.json({ error: "Déjà abonné", url: "/mon-espace" }, { status: 200 });
  }

  // Retrieve or create Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/mon-espace?subscribed=1`,
      cancel_url: `${origin}/`,
      subscription_data: {
        metadata: { userId: user.id, email: user.email ?? "" },
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}

