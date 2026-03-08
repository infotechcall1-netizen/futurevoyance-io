import type { OracleVibration } from "@/app/lib/oracle";

type DailyGuidanceProps = {
  firstName: string;
  date: Date;
  vibration: OracleVibration;
  sunSign?: string;
  risingSign?: string;
};

export default function DailyGuidance({
  firstName,
  date,
  vibration,
  sunSign,
  risingSign,
}: DailyGuidanceProps) {
  const dateFr = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
  const dateFullFr = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const personalMsg = vibration.personalMessage || vibration.dailyMessage;

  // Build contextual guidance from available data
  let astroContext = "";
  if (sunSign && risingSign) {
    astroContext = ` Avec ton ${sunSign} et ton ascendant ${risingSign}, cette énergie de ${vibration.keyword.toLowerCase()} résonne particulièrement avec ta nature profonde.`;
  } else if (sunSign) {
    astroContext = ` En tant que ${sunSign}, cette énergie de ${vibration.keyword.toLowerCase()} résonne naturellement avec ta lumière intérieure.`;
  }

  return (
    <section className="border-l-[3px] border-[#C9A961] bg-[#FBFAF7] p-6 md:p-8">
      <p className="font-[family-name:var(--font-playfair)] text-lg font-medium leading-snug text-[#1A1A1A] md:text-xl">
        ✦ {firstName}, voici ton énergie du {dateFr}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-[#1A1A1A]/75">
        {personalMsg}{astroContext}
      </p>

      <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/30">
        {dateFullFr}
      </p>
    </section>
  );
}
