"use client";

type DailyProps = { type: "daily"; steps: string[] };
type PersonalProps = {
  type: "personal";
  lifePathSteps?: string[];
  resonanceSteps?: string[];
};
type Props = DailyProps | PersonalProps;

export default function VibrationCalcBlock(props: Props) {
  if (props.type === "daily") {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-md border border-[#E5E3DD] bg-[#FBFAF7] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
          Calcul
        </p>
        <div className="mt-3 space-y-1">
          {props.steps.map((step, i) => (
            <p key={i} className="font-mono text-sm text-[#1A1A1A]/80">
              {step}
            </p>
          ))}
        </div>
      </div>
    );
  }

  const { lifePathSteps, resonanceSteps } = props;
  if (!lifePathSteps?.length && !resonanceSteps?.length) return null;

  return (
    <div className="mx-auto mt-6 max-w-md rounded-md border border-[#E5E3DD] bg-[#FBFAF7] px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
        Calcul
      </p>
      <div className="mt-3 space-y-1">
        {lifePathSteps && lifePathSteps.length > 0 && (
          <>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#C9A961]/70">
              Chemin de vie
            </p>
            {lifePathSteps.map((step, i) => (
              <p key={`lp-${i}`} className="font-mono text-sm text-[#1A1A1A]/80">
                {step}
              </p>
            ))}
          </>
        )}
        {resonanceSteps && resonanceSteps.length > 0 && (
          <>
            {lifePathSteps && lifePathSteps.length > 0 && (
              <div className="my-2 h-[1px] bg-[#E5E3DD]" />
            )}
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#C9A961]/70">
              Résonance personnelle
            </p>
            {resonanceSteps.map((step, i) => (
              <p key={`rs-${i}`} className="font-mono text-sm text-[#1A1A1A]/80">
                {step}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
