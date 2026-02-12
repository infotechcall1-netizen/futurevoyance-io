import type { PortalId } from "@/lib/oracle/schema";

export type PricingInfo = {
    module_id: string;
    portal_id: PortalId;
    label: string;
    value: number;
    tier: "2.99" | "3.99";
    stripe_price_id: string;
};

export const PRICING_CATALOG: Record<string, PricingInfo> = {
    "shadow-mirror": {
        module_id: "shadow-mirror",
        portal_id: "comprendre",
        label: "2,99 €",
        value: 2.99,
        tier: "2.99",
        stripe_price_id: "price_1SzPTDF768amoxL24h29xXS3",
    },
    "decision-ab": {
        module_id: "decision-ab",
        portal_id: "prevoir",
        label: "2,99 €",
        value: 2.99,
        tier: "2.99",
        stripe_price_id: "price_1SzPTDF768amoxL24h29xXS3",
    },
    "next-step-love": {
        module_id: "next-step-love",
        portal_id: "aimer",
        label: "3,99 €",
        value: 3.99,
        tier: "3.99",
        stripe_price_id: "price_1SzPUeF768amoxL2xqMsj9y6",
    },
    "abundance-key": {
        module_id: "abundance-key",
        portal_id: "recevoir",
        label: "3,99 €",
        value: 3.99,
        tier: "3.99",
        stripe_price_id: "price_1SzPUeF768amoxL2xqMsj9y6",
    },
};

export const DEFAULT_PRICE_LABEL = "2,99 €";
export const DEFAULT_PRICE_VALUE = 2.99;
export const DEFAULT_PRICE_TIER: PricingInfo["tier"] = "2.99";

export function getPricing(moduleId: string): PricingInfo | undefined {
    return PRICING_CATALOG[moduleId];
}
