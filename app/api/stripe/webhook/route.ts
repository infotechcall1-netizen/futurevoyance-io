import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { setEntitled } from "@/lib/entitlements/store";
import { markWebhookProcessed } from "@/lib/stripe/idempotency";

export const runtime = "nodejs";

function userKeyHash(userKey: string): string {
  return createHash("sha256").update(userKey).digest("hex").slice(0, 12);
}

function resolveUser(session: Stripe.Checkout.Session): { key: string | null; source: string | null } {
  const fromCustomerEmail = (session.customer_email || "").trim();
  if (fromCustomerEmail) {
    return { key: fromCustomerEmail.toLowerCase(), source: "customer_email" };
  }

  const fromCustomerDetails = (session.customer_details?.email || "").trim();
  if (fromCustomerDetails) {
    return { key: fromCustomerDetails.toLowerCase(), source: "customer_details.email" };
  }

  const fromClientRef = (session.client_reference_id || "").trim();
  if (fromClientRef) {
    return { key: fromClientRef, source: "client_reference_id" };
  }

  return { key: null, source: null };
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
    console.log(
      JSON.stringify({
        stripe_webhook_stage: "duplicate",
        event_id: event.id,
      })
    );
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const moduleId = (session.metadata?.module_id || "").trim();
    const resolved = resolveUser(session);
    const userKey = resolved.key;
    const userKeySource = resolved.source;

    if (!moduleId || !userKey) {
      console.warn(
        JSON.stringify({
          stripe_webhook_stage: "checkout.session.completed",
          entitlement_set: false,
          reason: !moduleId ? "missing_module_id" : "missing_user_key",
          user_key_source: userKeySource,
        })
      );
      return NextResponse.json({ received: true, skipped: true });
    }

    await setEntitled(userKey, moduleId);
    console.log(
      JSON.stringify({
        stripe_webhook_stage: "entitlement_set",
        module_id: moduleId,
        user_key_hash: userKeyHash(userKey),
        session_id: session.id,
      })
    );
  }

  return NextResponse.json({ received: true });
}
