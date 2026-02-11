type SafetyBannerProps = {
  category: string;
  disclaimerKey: string;
  referralText?: string | null;
};

const CATEGORY_PHRASES: Record<string, string> = {
  medical:
    "Pour toute question de santé, parle à un professionnel de santé.",
  legal: "Pour une situation juridique, consulte un professionnel du droit.",
  financial: "Pour une décision financière, demande un avis qualifié.",
  crisis:
    "Si tu es en détresse immédiate, contacte des services d'aide de ton pays.",
  self_harm:
    "Si tu es en détresse immédiate, contacte des services d'aide de ton pays.",
  violence:
    "Si tu te sens en danger, cherche de l'aide et de la protection.",
  harassment:
    "Si tu te sens en danger, cherche de l'aide et de la protection.",
};

export default function SafetyBanner({
  category,
  disclaimerKey,
  referralText,
}: SafetyBannerProps) {
  const extraText = referralText?.trim()
    ? referralText.trim()
    : CATEGORY_PHRASES[category] ?? null;

  return (
    <div
      className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3"
      data-disclaimer-key={disclaimerKey}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/90">
        Note importante
      </p>
      <p className="mt-1.5 text-sm text-slate-300/95">
        Cet Oracle propose une lecture symbolique et ne remplace pas un avis
        professionnel.
      </p>
      {extraText && (
        <p className="mt-2 text-sm text-amber-100/90">{extraText}</p>
      )}
    </div>
  );
}
