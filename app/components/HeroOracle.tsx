"use client";

import React from "react";
import { motion } from "framer-motion";
import OracleChat from "./OracleChat";
import Link from "next/link";

const HeroOracle: React.FC = () => (
  <section className="flex min-h-[85vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="flex justify-center">
      <span className="inline-flex items-center gap-x-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        FutureVoyance.io — Oracle vivant
      </span>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0 }}
      className="mt-8 max-w-3xl text-center"
    >
      <h1 className="block text-4xl font-bold leading-tight tracking-tight text-[#262626] md:text-6xl lg:text-7xl">
        Pose ta question.
        <br />
        <span className="bg-gradient-to-tl from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Découvre la vérité.
        </span>
      </h1>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-6 max-w-2xl text-center text-lg text-[#262626]/70"
    >
      Entre intuition et analyse symbolique, l&apos;Oracle traduit ce que les
      signes tentent déjà de te dire.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-6 w-full max-w-2xl"
    >
      <OracleChat
        anonymous
        compact
        placeholder="Qu'est-ce qui t'habite en ce moment ?"
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="mt-6 text-center"
    >
      <p className="text-sm text-[#262626]/70">
        ✨ Pour une guidance personnalisée basée sur ton thème astral et ta
        numérologie
      </p>
      <Link
        href="/login"
        className="fv-btn-primary mt-3 inline-block rounded-sm px-6 py-3 text-sm font-medium shadow-sm transition-all"
      >
        Créer mon profil gratuitement →
      </Link>
    </motion.div>
  </section>
);

export default HeroOracle;
