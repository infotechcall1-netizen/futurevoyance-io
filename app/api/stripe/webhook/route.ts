import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markWebhookProcessed } from "@/lib/stripe/idempotency";
import { setSubscription, cancelSubscription } from "@/lib/subscription";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// Stripe SDK v20 removed current_period_end from TS types (new API format),
// but it is present at runtime when using apiVersion "2023-10-16".
type StripeSubLegacy = Stripe.Subscription & { current_period_end: number };

// ── Helper: resolve email from a Stripe customer id ─────────────────────────
async function resolveEmailFromCustomer(
  stripe: Stripe,
  customerId: string
): Promise<string | null> {
  try {
    // Check our DB first (avoid extra Stripe API call if possible)
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { email: true },
    });
    if (user?.email) return user.email.toLowerCase();

    // Fall back to Stripe API
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return (customer.email || "").toLowerCase() || null;
  } catch (err) {
    console.error("[webhook] resolveEmailFromCustomer error:", err);
    return null;
  }
}

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(
    JSON.stringify({
      stripe_webhook_stage: "received",
      event_id: event.id,
      event_type: event.type,
    })
  );

  const isFirstProcessing = await markWebhookProcessed(event.id);
  if (!isFirstProcessing) {
    console.log(JSON.stringify({ stripe_webhook_stage: "duplicate", event_id: event.id }));
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    // ── New subscription created via Checkout ──────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only handle subscription mode sessions
      if (session.mode !== "subscription") {
        // LEGACY: module entitlements (micro-achats) — à réactiver pour Sprint 4 micro-achats
        // const moduleId = (session.metadata?.module_id || "").trim();
        // const resolved = resolveUser(session);
        // const userKey = resolved.key;
        // if (moduleId && userKey) await setEntitled(userKey, moduleId);
        console.log(JSON.stringify({ stripe_webhook_stage: "checkout.session.completed", mode: session.mode, skipped: true }));
        break;
      }

      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      if (!customerId || !subscriptionId) {
        console.warn(JSON.stringify({ stripe_webhook_stage: "checkout.session.completed", error: "missing customer or subscription id" }));
        break;
      }

      const email = await resolveEmailFromCustomer(stripe, customerId);
      if (!email) {
        console.warn(JSON.stringify({ stripe_webhook_stage: "checkout.session.completed", error: "could not resolve email", customerId }));
        break;
      }

      const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as StripeSubLegacy;
      await setSubscription(email, {
        stripeCustomerId: customerId,
        subscriptionId: sub.id,
        subscriptionStatus: sub.status,
        subscriptionPlanId: sub.items.data[0]?.price.id ?? "",
        subscriptionEnd: new Date(sub.current_period_end * 1000),
      });

      console.log(JSON.stringify({ webhook_event: event.type, email, status: sub.status }));
      break;
    }

    // ── Subscription updated (renewal, plan change, status change) ─────────
    case "customer.subscription.updated": {
      const sub = event.data.object as StripeSubLegacy;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const email = await resolveEmailFromCustomer(stripe, customerId);
      if (!email) {
        console.warn(JSON.stringify({ stripe_webhook_stage: "customer.subscription.updated", error: "could not resolve email", customerId }));
        break;
      }

      await setSubscription(email, {
        stripeCustomerId: customerId,
        subscriptionId: sub.id,
        subscriptionStatus: sub.status,
        subscriptionPlanId: sub.items.data[0]?.price.id ?? "",
        subscriptionEnd: new Date(sub.current_period_end * 1000),
      });

      console.log(JSON.stringify({ webhook_event: event.type, email, status: sub.status }));
      break;
    }

    // ── Subscription deleted (canceled + period ended) ─────────────────────
    case "customer.subscription.deleted": {
      const sub = event.data.object as StripeSubLegacy;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const email = await resolveEmailFromCustomer(stripe, customerId);
      if (!email) {
        console.warn(JSON.stringify({ stripe_webhook_stage: "customer.subscription.deleted", error: "could not resolve email", customerId }));
        break;
      }

      await cancelSubscription(email);
      console.log(JSON.stringify({ webhook_event: event.type, email }));
      break;
    }

    // ── Payment failed ─────────────────────────────────────────────────────
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

      if (!customerId) break;

      const email = await resolveEmailFromCustomer(stripe, customerId);
      if (!email) {
        console.warn(JSON.stringify({ stripe_webhook_stage: "invoice.payment_failed", error: "could not resolve email", customerId }));
        break;
      }

      await prisma.user.update({
        where: { email },
        data: { subscriptionStatus: "past_due" },
      });

      console.log(JSON.stringify({ webhook_event: event.type, email, status: "past_due" }));
      break;
    }

    default:
      console.log(JSON.stringify({ stripe_webhook_stage: "ignored", event_type: event.type }));
      break;
  }

  return NextResponse.json({ received: true });
}
