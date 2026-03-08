import prisma from "@/lib/prisma";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "none";

export async function getSubscriptionStatus(email: string): Promise<SubscriptionStatus> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { subscriptionStatus: true, subscriptionEnd: true },
    });
    if (!user || !user.subscriptionStatus) return "none";
    const status = user.subscriptionStatus as SubscriptionStatus;
    // A canceled sub is still accessible until subscriptionEnd
    if (status === "canceled" && user.subscriptionEnd && user.subscriptionEnd > new Date()) {
      return "canceled";
    }
    return status;
  } catch (err) {
    console.error("[subscription] getSubscriptionStatus error:", err);
    return "none";
  }
}

export async function isSubscribed(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { subscriptionStatus: true, subscriptionEnd: true },
    });
    if (!user || !user.subscriptionStatus) return false;
    const status = user.subscriptionStatus;
    if (status === "active" || status === "trialing") return true;
    if (status === "canceled" && user.subscriptionEnd && user.subscriptionEnd > new Date()) return true;
    return false;
  } catch (err) {
    console.error("[subscription] isSubscribed error:", err);
    return false;
  }
}

export async function canAccessPremium(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  return isSubscribed(email);
}

export async function setSubscription(
  email: string,
  data: {
    stripeCustomerId: string;
    subscriptionId: string;
    subscriptionStatus: string;
    subscriptionPlanId: string;
    subscriptionEnd: Date;
  }
): Promise<void> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        stripeCustomerId: data.stripeCustomerId,
        subscriptionId: data.subscriptionId,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionPlanId: data.subscriptionPlanId,
        subscriptionEnd: data.subscriptionEnd,
      },
    });
  } catch (err) {
    console.error("[subscription] setSubscription error:", err);
  }
}

export async function cancelSubscription(email: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { email },
      data: { subscriptionStatus: "canceled" },
    });
  } catch (err) {
    console.error("[subscription] cancelSubscription error:", err);
  }
}
