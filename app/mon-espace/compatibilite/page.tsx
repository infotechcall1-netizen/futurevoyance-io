"use client";

import { useState } from "react";
import Link from "next/link";
import { firstNameCompatibility } from "@/lib/numerology";
import { signCompatibility, ELEMENT_COLORS } from "@/lib/compatibility";
import { ZODIAC_SIGNS } from "@/lib/astrology/constants";
import type { Element } from "@/lib/compatibility";

type Tab = "prenoms" | "signes";

export default function CompatibilitePage() {
  const [activeTab, setActiveTab] = useState<Tab>("prenoms");

  // Prénoms tab state
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  // Signes tab state
  const [sign1, setSign1] = useState("");
  const [sign2, setSign2] = useState("");

  // Results
  const nameResult =
    name1.length >= 2 && name2.length >= 2
      ? firstNameCompatibility(name1, name2)
      : null;

  const signResult =
    sign1 && sign2 ? signCompatibility(sign1, sign2) : null;

  const scoreColor = (score: number) => {
    if (score >= 8) return "#059669"; // green
    if (score >= 6) return "#C9A961"; // gold
    return "#DB2777"; // pink
  };

  return (
    <div className="space-y-16">
      <header className="space-y-5">
        <Link
          href="/mon-espace"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70 transition-colors"
        >
          ← Mon Espace
        </Link>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Compatibilité
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Deux prénoms, deux signes — découvrez votre résonance vibratoire et votre compatibilité astrologique.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E3DD]">
        {(["prenoms", "signes"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            }`}
          >
            {tab === "prenoms" ? "Prénoms" : "Signes astraux"}
          </button>
        ))}
      </div>

      {/* Onglet Prénoms */}
      {activeTab === "prenoms" && (
        <section className="space-y-8">
          <p className="text-sm text-[#1A1A1A]/60">
            La numérologie Pythagoricienne attribue une vibration à chaque prénom selon la valeur de ses lettres. Compare deux vibrations pour mesurer votre résonance.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                Prénom 1
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Marie"
                className="rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-base text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none transition-colors"
              />
            </div>

            <span className="mt-5 text-2xl text-[#1A1A1A]/20">♡</span>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                Prénom 2
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Paul"
                className="rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-base text-[#1A1A1A] focus:border-[#7C3AED] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {nameResult && nameResult.score > 0 && (
            <div className="max-w-lg space-y-6">
              {/* vib1 + vib2 = nombre couple */}
              <div className="flex items-center gap-3 text-center">
                <div className="flex-1 rounded-md border border-[#E5E3DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    {name1}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#7C3AED]">{nameResult.vib1}</p>
                </div>
                <span className="text-lg text-[#1A1A1A]/20">+</span>
                <div className="flex-1 rounded-md border border-[#E5E3DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    {name2}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#7C3AED]">{nameResult.vib2}</p>
                </div>
                <span className="text-lg text-[#1A1A1A]/20">=</span>
                {/* Nombre couple — résultat central */}
                <div className="flex-1 rounded-md border border-[#DB2777]/30 bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DB2777]/70">
                    Nombre couple
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#DB2777]">
                    {nameResult.coupleNumber}
                  </p>
                </div>
              </div>

              {/* Score + résultat */}
              <div className="space-y-4 rounded-md border border-[#E5E3DD] bg-white/60 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E3DD]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${nameResult.score * 10}%`,
                        backgroundColor: scoreColor(nameResult.score),
                      }}
                    />
                  </div>
                  <span className="min-w-[3rem] text-right text-sm font-bold" style={{ color: scoreColor(nameResult.score) }}>
                    {nameResult.score}/10
                  </span>
                </div>

                <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                  {nameResult.title}
                </p>
                <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
                  {nameResult.description}
                </p>
                <div className="border-l-2 border-[#C9A961]/40 bg-[#FBFAF7] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A961]">
                    Conseil
                  </p>
                  <p className="mt-1 text-sm text-[#1A1A1A]/70">{nameResult.advice}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Onglet Signes */}
      {activeTab === "signes" && (
        <section className="space-y-8">
          <p className="text-sm text-[#1A1A1A]/60">
            L&apos;astrologie traditionnelle classe les signes en quatre éléments. La compatibilité élémentale révèle la dynamique naturelle entre deux personnes.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                Signe 1
              </label>
              <select
                value={sign1}
                onChange={(e) => setSign1(e.target.value)}
                className="rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-base text-[#1A1A1A] focus:border-[#C9A961] focus:outline-none transition-colors"
              >
                <option value="">Choisir…</option>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.name} value={s.french}>
                    {s.symbol} {s.french}
                  </option>
                ))}
              </select>
            </div>

            <span className="mt-5 text-2xl text-[#1A1A1A]/20">+</span>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                Signe 2
              </label>
              <select
                value={sign2}
                onChange={(e) => setSign2(e.target.value)}
                className="rounded-sm border border-[#E5E3DD] bg-[#FBFAF7] px-4 py-3 text-base text-[#1A1A1A] focus:border-[#C9A961] focus:outline-none transition-colors"
              >
                <option value="">Choisir…</option>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.name} value={s.french}>
                    {s.symbol} {s.french}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {signResult && (
            <div className="max-w-lg space-y-6">
              {/* Elements */}
              <div className="flex gap-6 text-center">
                <div className="flex-1 border border-[#E5E3DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    {sign1}
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: ELEMENT_COLORS[signResult.element1 as Element] }}
                  >
                    {signResult.element1}
                  </p>
                </div>
                <div className="flex items-center text-[#1A1A1A]/20 text-2xl">×</div>
                <div className="flex-1 border border-[#E5E3DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    {sign2}
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: ELEMENT_COLORS[signResult.element2 as Element] }}
                  >
                    {signResult.element2}
                  </p>
                </div>
              </div>

              {/* Score + résultat */}
              <div className="space-y-4 border-l-2 border-[#C9A961] pl-5">
                <div className="flex items-center gap-4">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E3DD]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${signResult.score * 10}%`,
                        backgroundColor: scoreColor(signResult.score),
                      }}
                    />
                  </div>
                  <span className="min-w-[3rem] text-right text-sm font-bold" style={{ color: scoreColor(signResult.score) }}>
                    {signResult.score}/10
                  </span>
                </div>

                <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                  {signResult.title}
                </p>
                <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
                  {signResult.description}
                </p>
                <div className="border border-[#E5E3DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                    Conseil
                  </p>
                  <p className="mt-1 text-sm text-[#1A1A1A]/70">{signResult.advice}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
