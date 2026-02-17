"use client";

import React from "react";

const HeroOracle: React.FC = () => (
  <div className="relative overflow-hidden before:absolute before:top-0 before:left-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-10 before:transform before:-translate-x-1/2">
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-x-2 bg-white/70 dark:bg-black/30 backdrop-blur border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 px-4 py-2 rounded-full">
          FutureVoyance.io — Oracle vivant
        </span>
      </div>
      <div className="mt-8 max-w-3xl text-center mx-auto">
        <h1 className="block font-bold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-slate-900 dark:text-white">
          Pose ta question.<br />
          <span className="bg-clip-text bg-gradient-to-tl from-violet-600 to-indigo-600 text-transparent">
            Découvre la vérité.
          </span>
        </h1>
      </div>
      <div className="mt-6 max-w-2xl text-center mx-auto">
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Entre intuition et analyse symbolique, l’Oracle traduit ce que les signes tentent déjà de te dire.
        </p>
      </div>
      <div className="mt-10 gap-4 flex justify-center">
        <a
          className="inline-flex justify-center items-center gap-x-3 bg-gradient-to-tl from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-md hover:opacity-90"
          href="#oracle"
        >
          Tester l’Oracle
        </a>
        <a
          className="inline-flex justify-center items-center gap-x-3 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-md text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
          href="/comprendre"
        >
          Explorer les Portails
        </a>
      </div>
    </div>
  </div>
);

export default HeroOracle;
