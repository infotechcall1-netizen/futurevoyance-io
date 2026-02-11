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
      className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6"
      data-module-id={moduleId}
    >
      <h2 className="text-lg font-semibold text-slate-50">Accès Premium</h2>
      <p className="mt-2 text-sm text-slate-300/90">
        Débloque cette lecture pour aller plus loin.
      </p>
      <p className="mt-3 text-base font-medium text-amber-200">{priceLabel}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onUnlock}
          disabled={disabled}
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Débloquer
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-500/50 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800/50"
        >
          Plus tard
        </button>
      </div>
    </section>
  );
}
