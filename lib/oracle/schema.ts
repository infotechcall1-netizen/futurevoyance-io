import { z } from "zod";

export const portalIdSchema = z.enum(["comprendre", "aimer", "prevoir", "recevoir"]);

export const moduleIdSchema = z.enum([
  "vibe-check",
  "shadow-mirror",
  "heart-sync",
  "next-step-love",
  "weekly-window",
  "decision-ab",
  "daily-mantra",
  "abundance-key",
]);

export const offerIdSchema = z.enum([
  "fv_micro_deep",
  "fv_pack_vision_3",
  "fv_sub_order_monthly",
]);

export const safetyCategorySchema = z.enum([
  "none",
  "medical",
  "legal",
  "financial",
  "crisis",
  "self_harm",
  "violence",
  "harassment",
]);

export const oracleResponseSchema = z.object({
  version: z.literal("1.2"),
  routing: z.object({
    portal_id: portalIdSchema,
    module_id: moduleIdSchema,
    paywall: z.object({
      eligible: z.boolean(),
      offer_id: offerIdSchema.nullable(),
      reason: z.string().max(200).nullable(),
    }),
  }),
  content: z.object({
    essentiel: z.string().max(160),
    lecture: z.array(z.string().max(140)).min(3).max(5),
    action: z.string().max(160),
    share_card_text: z.string().max(120),
    cta_label: z.string().max(48),
  }),
  safety: z.object({
    category: safetyCategorySchema,
    disclaimer_key: z.string().max(64),
    referral_text: z.string().max(160).nullable(),
  }),
});

export type OracleResponse = z.infer<typeof oracleResponseSchema>;
export type PortalId = z.infer<typeof portalIdSchema>;

export const premiumAlchemyContentSchema = z.object({
  essentiel: z.string().max(160),
  lecture: z.array(z.string().max(160)).min(2).max(6),
  action: z.string().max(160),
  share_card_text: z.string().max(120),
  cta_label: z.string().max(48),
  archetype: z.string().max(48),
  ombre: z.string().max(160),
  initiation: z.string().max(160),
  transmutation: z.string().max(160),
  rituel: z.string().max(160),
});

export const premiumOracleResponseSchema = z.object({
  version: z.literal("1.2"),
  routing: z.object({
    portal_id: portalIdSchema,
    module_id: moduleIdSchema,
    paywall: z.object({
      eligible: z.boolean(),
      offer_id: offerIdSchema.nullable(),
      reason: z.string().max(200).nullable(),
    }),
  }),
  content: premiumAlchemyContentSchema,
  safety: z.object({
    category: safetyCategorySchema,
    disclaimer_key: z.string().max(64),
    referral_text: z.string().max(160).nullable(),
  }),
});

export type PremiumOracleResponse = z.infer<typeof premiumOracleResponseSchema>;
