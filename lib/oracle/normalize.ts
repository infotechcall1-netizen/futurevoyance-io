import type { OracleResponse, PremiumOracleResponse } from "@/lib/oracle/schema";

const PAD_LECTURE = "Reviens à l'essentiel : une seule action claire, maintenant.";
const DEFAULT_ESSENTIEL = "Reviens à l'essentiel : une seule priorité, maintenant.";
const DEFAULT_ACTION = "Choisis une action de 10 minutes à faire dans l'heure.";
const DEFAULT_SHARE_CARD = "Une seule priorité. Un seul pas. Et tout s'éclaire.";
const DEFAULT_CTA = "Aller plus loin";

const DEFAULT_ARCHETYPE = "Le Gardien";
const DEFAULT_OMBRE = "Une résistance demande ton attention.";
const DEFAULT_INITIATION = "Un seuil s'offre à toi.";
const DEFAULT_TRANSMUTATION = "L'ombre devient lumière par l'attention consciente.";
const DEFAULT_RITUEL = "Pose ta main sur ton cœur, respire trois fois.";

function trimAndClamp(s: string, maxLen: number): string {
  return s.trim().slice(0, maxLen);
}

function trimClampOrDefault(
  s: string,
  maxLen: number,
  fallback: string
): string {
  const t = s.trim().slice(0, maxLen);
  return t === "" ? fallback : t;
}

export function normalizeOracleResponse(
  r: OracleResponse | PremiumOracleResponse
): OracleResponse | PremiumOracleResponse {
  const eligible = r.routing.paywall.eligible;

  const paywall = {
    eligible,
    offer_id: eligible ? r.routing.paywall.offer_id : null,
    reason: eligible
      ? r.routing.paywall.reason !== null
        ? trimAndClamp(r.routing.paywall.reason, 200)
        : null
      : null,
  };

  const isPremium = "archetype" in r.content;

  const lectureMaxLength = isPremium ? 160 : 140;
  const lectureRaw = r.content.lecture.map((item) =>
    trimAndClamp(item, lectureMaxLength)
  );
  
  const lecture = isPremium
    ? lectureRaw.length >= 2
      ? lectureRaw.slice(0, 6)
      : lectureRaw
    : lectureRaw.length >= 3
    ? lectureRaw.slice(0, 3)
    : [...lectureRaw, ...Array(3 - lectureRaw.length).fill(PAD_LECTURE)];

  const essentiel = trimClampOrDefault(
    r.content.essentiel,
    160,
    DEFAULT_ESSENTIEL
  );
  const action = trimClampOrDefault(r.content.action, 160, DEFAULT_ACTION);
  const share_card_text = trimClampOrDefault(
    r.content.share_card_text,
    120,
    DEFAULT_SHARE_CARD
  );
  const cta_label = trimClampOrDefault(r.content.cta_label, 48, DEFAULT_CTA);

  const disclaimerKeyRaw = r.safety.disclaimer_key;
  const disclaimer_key = trimAndClamp(
    typeof disclaimerKeyRaw === "string" && disclaimerKeyRaw.trim() !== ""
      ? disclaimerKeyRaw
      : "none",
    64
  );
  const rawReferral = r.safety.referral_text?.trim().slice(0, 160) ?? "";
  const referral_text = rawReferral === "" ? null : rawReferral;

  const baseContent = {
    essentiel,
    lecture,
    action,
    share_card_text,
    cta_label,
  };

  const content = isPremium
    ? {
        ...baseContent,
        archetype: trimClampOrDefault(
          (r.content as any).archetype,
          48,
          DEFAULT_ARCHETYPE
        ),
        ombre: trimClampOrDefault(
          (r.content as any).ombre,
          160,
          DEFAULT_OMBRE
        ),
        initiation: trimClampOrDefault(
          (r.content as any).initiation,
          160,
          DEFAULT_INITIATION
        ),
        transmutation: trimClampOrDefault(
          (r.content as any).transmutation,
          160,
          DEFAULT_TRANSMUTATION
        ),
        rituel: trimClampOrDefault(
          (r.content as any).rituel,
          160,
          DEFAULT_RITUEL
        ),
      }
    : baseContent;

  return {
    version: r.version,
    routing: {
      portal_id: r.routing.portal_id,
      module_id: r.routing.module_id,
      paywall,
    },
    content,
    safety: {
      category: r.safety.category,
      disclaimer_key,
      referral_text,
    },
  } as OracleResponse | PremiumOracleResponse;
}
