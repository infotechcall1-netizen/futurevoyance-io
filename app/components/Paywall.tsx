"use client";

type PaywallProps = {
  moduleId: string;
  title: string;
  priceLabel: string;
  onUnlock: () => void;
  disabled?: boolean;
};

export default function Paywall({
  moduleId,
  title,
  priceLabel,
  onUnlock,
  disabled = false,
}: PaywallProps) {
  return (
    <section
      className="border-l-2 border-[#C9A961] bg-[#FBFAF7] p-8"
      data-module-id={moduleId}
    >
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#1A1A1A]">Accès Premium</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/70">
        Débloque cette lecture pour aller plus loin.
      </p>
      <p className="mt-4 text-base font-medium text-[#C9A961]">{priceLabel}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onUnlock}
          disabled={disabled}
          className="rounded-sm bg-[#7C3AED] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Débloquer
        </button>
        <button
          type="button"
          className="rounded-sm border border-[#E5E3DD] px-6 py-3 text-sm font-medium text-[#1A1A1A]/70 transition hover:border-[#1A1A1A]/30"
        >
          Plus tard
        </button>
      </div>
    </section>
  );
}
