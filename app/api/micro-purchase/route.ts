import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { findProduct } from "@/lib/microPurchases/catalog";
import { isSubscribed } from "@/lib/subscription";
import { generateMicroContent } from "./generate/generateContent";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const body = await req.json();
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const product = findProduct(productId);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, stripeCustomerId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Subscribers get micro-purchases for free
  const subscribed = await isSubscribed(session.user.email);
  if (subscribed) {
    const purchase = await prisma.purchase.create({
      data: { userId: user.id, productId: product.id },
    });

    try {
      const content = await generateMicroContent(purchase.id, product, user.id);
      return NextResponse.json({ purchaseId: purchase.id, content });
    } catch (err) {
      console.error("[micro-purchase] Generation failed for subscriber:", err);
      return NextResponse.json(
        { error: "Erreur de génération" },
        { status: 500 }
      );
    }
  }

  // Non-subscriber: create Purchase (content=null) then redirect to Stripe
  if (!product.stripePriceId) {
    return NextResponse.json({ error: "Prix Stripe non configuré" }, { status: 500 });
  }

  const purchase = await prisma.purchase.create({
    data: { userId: user.id, productId: product.id },
  });

  const stripe = new Stripe(secret, {
    apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
  });

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
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      success_url: `${origin}/mon-espace/achat/${purchase.id}?paid=1`,
      cancel_url: `${origin}/mon-espace`,
      metadata: { userId: user.id, purchaseId: purchase.id, productId: product.id },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[micro-purchase] Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
