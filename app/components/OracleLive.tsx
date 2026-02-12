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
    <div className="space-y-8">
      {/* Vibration du jour vivante */}
      <section className="grid gap-6 rounded-3xl border border-violet-500/25 bg-slate-950/60 p-6 shadow-[0_0_80px_rgba(15,23,42,0.9)] ring-1 ring-slate-50/5 md:grid-cols-[1.1fr_1.2fr]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200/90">
            Vibration du jour
          </p>
          <p className="text-sm text-slate-300/90">{todayLabel}</p>
          <p className="mt-4 text-3xl font-semibold text-violet-100">
            {dayOracle.vibration} – {dayOracle.title}
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-violet-300/90">
            {dayOracle.keyword}
          </p>
          <button
            type="button"
            onClick={handleRevealDay}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400"
          >
            <span>🔮</span>
            <span>Révéler le message du jour</span>
          </button>
        </div>
        <div className="space-y-3 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/60 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-violet-200/90">
            Message de l&apos;Oracle
          </p>
          {showDayDetails ? (
            <>
              <p className="text-sm text-slate-200/90">{dayOracle.dailyMessage}</p>
              <div className="mt-3 rounded-xl border border-violet-500/30 bg-slate-950/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/90">
                  Rituel du jour
                </p>
                <p className="mt-1 text-xs text-slate-200/85">{dayOracle.dailyRitual}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-200/80">
              Ferme un instant les yeux, sens la couleur de ta journée… puis clique sur
              « Révéler » quand tu te sens prêt·e à recevoir le message.
            </p>
          )}
        </div>
      </section>

      {/* Oracle personnel interactif */}
      <section className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-50">
            Activer ton Oracle personnel
          </h2>
          <p className="text-sm text-slate-300/85">
            En reliant ta date de naissance à la vibration du jour, l&apos;Oracle
            compose une lecture qui te parle directement, à ton rythme.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-xs text-slate-300/80">
            Date de naissance
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-1 w-52 rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/60"
            />
          </label>
          <button
            type="button"
            onClick={handleActivatePersonal}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_40px_rgba(139,92,246,0.6)] transition hover:bg-violet-400 sm:mt-6"
          >
            <span>✨</span>
            <span>Activer</span>
          </button>
          {personalActivated && personalOracle && (
            <button
              type="button"
              onClick={handleRevealPersonal}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-300/60 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-100 transition hover:border-violet-200 hover:bg-violet-500/20 sm:mt-6"
            >
              <span>🔮</span>
              <span>Révéler mon Oracle personnel</span>
            </button>
          )}
        </div>
        {birthError && (
          <p className="text-xs text-rose-300/90">
            {birthError}
          </p>
        )}
        {personalActivated && personalOracle && (
          <div className="mt-4 space-y-3 rounded-2xl border border-violet-500/30 bg-slate-950/70 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-violet-200/90">
                  Oracle personnel du moment
                </p>
                <p className="mt-2 text-base font-semibold text-violet-100">
                  {personalOracle.vibration} – {personalOracle.title}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-violet-300/90">
                  {personalOracle.keyword}
                </p>
              </div>
            </div>
            {showPersonalDetails ? (
              <>
                <p className="text-sm text-slate-200/90">
                  {personalOracle.personalMessage}
                </p>
                <div className="mt-3 rounded-xl border border-violet-500/30 bg-slate-950/60 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/90">
                    Rituel à ancrer
                  </p>
                  <p className="mt-1 text-xs text-slate-200/85">
                    {personalOracle.personalRitual}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-200/80">
                Respire profondément trois fois, centre-toi sur ton année à venir,
                puis clique sur « Révéler » quand tu te sens aligné·e avec la réponse.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

