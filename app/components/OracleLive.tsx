"use client";

import { useState } from "react";
import type { OracleVibration } from "../lib/oracle";
import { oraclePersonal } from "../lib/oracle";
import { trackEvent } from "@/lib/analytics/track";

type OracleLiveProps = {
  todayLabel: string;
  initialDayOracle: OracleVibration;
};



export default function OracleLive({ todayLabel, initialDayOracle }: OracleLiveProps) {
  const [dayOracle] = useState<OracleVibration>(initialDayOracle);
  const [showDayDetails, setShowDayDetails] = useState(false);

  const [birthDate, setBirthDate] = useState<string>("");
  const [personalOracle, setPersonalOracle] = useState<OracleVibration | null>(null);
  const [personalActivated, setPersonalActivated] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [birthError, setBirthError] = useState<string | null>(null);

  const handleRevealDay = () => {
    setShowDayDetails(true);
    trackEvent("oracle_reveal_day", {
      vibration: dayOracle.vibration,
      keyword: dayOracle.keyword,
    });
  };

  const handleActivatePersonal = () => {
    if (!birthDate) {
      setBirthError("Indique ta date de naissance pour activer ton Oracle personnel.");
      return;
    }
    setBirthError(null);

    const today = new Date();
    const oracle = oraclePersonal(today, birthDate);
    setPersonalOracle(oracle);
    setPersonalActivated(true);
    setShowPersonalDetails(false);

    trackEvent("oracle_activate_personal", {
      vibration: oracle.vibration,
      keyword: oracle.keyword,
    });
  };

  const handleRevealPersonal = () => {
    if (!personalOracle) return;
    setShowPersonalDetails(true);
    trackEvent("oracle_reveal_personal", {
      vibration: personalOracle.vibration,
      keyword: personalOracle.keyword,
    });
  };

  return (
    <div className="space-y-20">
      {/* Vibration du jour vivante */}
      <section className="border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-8 py-12 md:grid md:grid-cols-2 md:gap-12">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A961]">
              Vibration du jour
            </p>
            <p className="mt-1 text-sm text-[#1A1A1A]/50">{todayLabel}</p>
          </div>
          
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight text-[#7C3AED]">
              {dayOracle.vibration}
            </p>
            <p className="mt-2 text-xl text-[#1A1A1A]">{dayOracle.title}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#7C3AED]/60">
              {dayOracle.keyword}
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleRevealDay}
            className="inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#6D28D9]"
          >
            <span>🔮</span>
            <span>Révéler le message</span>
          </button>
        </div>
        
        <div className="mt-8 space-y-4 md:mt-0">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#C9A961]">
            Message de l&apos;Oracle
          </p>
          {showDayDetails ? (
            <>
              <p className="text-base leading-relaxed text-[#1A1A1A]">
                {dayOracle.dailyMessage}
              </p>
              <div className="mt-4 border-l-2 border-[#C9A961]/40 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#C9A961]">
                  Rituel du jour
                </p>
                <p className="mt-2 text-sm text-[#1A1A1A]/80">
                  {dayOracle.dailyRitual}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
              Ferme un instant les yeux, sens la couleur de ta journée… puis clique sur
              « Révéler » quand tu te sens prêt·e.
            </p>
          )}
        </div>
      </section>

      {/* Oracle personnel interactif */}
      <section className="space-y-10 bg-[#FBFAF7] px-8 py-16">
        <div className="space-y-4 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[#1A1A1A]">
            Activer ton Oracle personnel
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1A1A1A]/60">
            En reliant ta date de naissance à la vibration du jour, l&apos;Oracle
            compose une lecture qui te parle directement, à ton rythme.
          </p>
        </div>
        
        <div className="mx-auto flex max-w-md flex-col items-center gap-5">
          <label className="w-full text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C9A961]">
              Date de naissance
            </span>
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full border-b border-[#E5E3DD] bg-transparent px-2 py-3 text-center text-base text-[#1A1A1A] outline-none focus:border-[#7C3AED]"
            />
          </label>
          
          <button
            type="button"
            onClick={handleActivatePersonal}
            className="inline-flex items-center gap-2 rounded-sm bg-[#7C3AED] px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#6D28D9]"
          >
            <span>✨</span>
            <span>Activer</span>
          </button>
          
          {personalActivated && personalOracle && (
            <button
              type="button"
              onClick={handleRevealPersonal}
              className="inline-flex items-center gap-2 rounded-sm border border-[#C9A961]/50 bg-transparent px-8 py-3 text-sm font-medium text-[#C9A961] transition-all hover:border-[#C9A961]/70"
            >
              <span>🔮</span>
              <span>Révéler mon Oracle</span>
            </button>
          )}
        </div>
        
        {birthError && (
          <p className="text-center text-xs text-red-600">
            {birthError}
          </p>
        )}
        
        {personalActivated && personalOracle && (
          <div className="mx-auto mt-10 max-w-2xl space-y-6 border-t border-[#E5E3DD] pt-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#C9A961]">
                Oracle personnel
              </p>
              <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#7C3AED]">
                {personalOracle.vibration}
              </p>
              <p className="mt-1 text-lg text-[#1A1A1A]">
                {personalOracle.title}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#7C3AED]/60">
                {personalOracle.keyword}
              </p>
            </div>
            
            {showPersonalDetails ? (
              <>
                <p className="text-base leading-relaxed text-[#1A1A1A]">
                  {personalOracle.personalMessage}
                </p>
                <div className="border-l-2 border-[#C9A961]/40 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#C9A961]">
                    Rituel à ancrer
                  </p>
                  <p className="mt-2 text-sm text-[#1A1A1A]/80">
                    {personalOracle.personalRitual}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-[#1A1A1A]/60">
                Respire profondément trois fois, centre-toi sur ton année à venir,
                puis clique sur « Révéler » quand tu te sens aligné·e.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

