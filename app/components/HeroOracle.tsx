"use client";

import React from "react";

const HeroOracle: React.FC = () => (
  <div className="relative overflow-hidden">
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex justify-center">
        <span className="fv-card fv-kicker inline-flex items-center gap-x-2 px-4 py-2 text-[11px] text-[#262626]/80">
          FutureVoyance.io — Oracle vivant
        </span>
      </div>
      <div className="mt-8 max-w-3xl text-center mx-auto">
        <h1 className="fv-title block text-4xl font-bold leading-tight tracking-tight text-[#262626] md:text-6xl lg:text-7xl">
          Pose ta question.<br />
          <span className="bg-clip-text bg-gradient-to-tl from-[#262626] to-[#6B7280] text-transparent">
            Découvre la vérité.
          </span>
        </h1>
      </div>
      <div className="mt-6 max-w-2xl text-center mx-auto">
        <p className="fv-muted text-lg">
          Entre intuition et analyse symbolique, l’Oracle traduit ce que les signes tentent déjà de te dire.
        </p>
      </div>
      <div className="mt-10 gap-4 flex justify-center">
        <a
          className="fv-btn-primary inline-flex items-center justify-center gap-x-3 rounded-sm"
          href="#oracle"
        >
          Tester l’Oracle
        </a>
        <a
          className="fv-btn-secondary inline-flex items-center justify-center gap-x-3 rounded-sm"
          href="/comprendre"
        >
          Explorer les Portails
        </a>
      </div>
    </div>
  </div>
);

export default HeroOracle;
