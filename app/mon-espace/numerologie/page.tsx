import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { oracleOfDay, lifePathFromDate } from "@/app/lib/oracle";
import { firstNameVibration, vibrationKeyword, vibrationTitle } from "@/lib/numerology";
import VibrationCalcBlock from "@/app/components/VibrationCalcBlock";

export const metadata: Metadata = {
  title: "Numérologie · Mon Espace | FutureVoyance",
  description:
    "Découvre ton chemin de vie, la vibration de ton prénom et ton oracle numérique personnel.",
};
export const dynamic = "force-dynamic";

export default async function NumerologiePage() {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/mon-espace/numerologie");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      firstName: true,
      name: true,
      birthDate: true,
    },
  });

  const today = new Date();
  const dayOracle = oracleOfDay(today);

  // Life path
  let lifePath: number | null = null;
  let lifePathSteps: string[] = [];
  if (user?.birthDate) {
    const bd = user.birthDate;
    const day = bd.getDate();
    const month = bd.getMonth() + 1;
    const year = bd.getFullYear();
    const dateStr = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    const lp = lifePathFromDate(dateStr);
    lifePath = lp.traditional;
    lifePathSteps = lp.steps;
  }

  // Name vibration
  const firstName = user?.firstName || user?.name?.split(" ")[0] || null;
  const nameVib = firstName ? firstNameVibration(firstName) : null;
  const nameKeyword = nameVib ? vibrationKeyword(nameVib) : null;
  const nameTitle = nameVib ? vibrationTitle(nameVib) : null;

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
          Ma Numérologie
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          Les nombres révèlent la structure invisible de ton chemin. Ton chemin de vie, la vibration
          de ton prénom et l&apos;énergie du jour forment ensemble ta signature numérique.
        </p>
      </header>

      {/* Oracle du jour */}
      <section className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A961]">
          Vibration du jour
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-l-2 border-[#C9A961] bg-[#FBFAF7] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A961]">
              Nombre · {dayOracle.vibration}
            </p>
            <p className="mt-2 font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
              {dayOracle.title}
            </p>
            <p className="mt-1 text-xs text-[#1A1A1A]/50">{dayOracle.keyword}</p>
          </div>
          <div className="border border-[#E5E3DD] bg-[#FBFAF7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">Message</p>
            <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">{dayOracle.dailyMessage}</p>
          </div>
          <div className="border border-[#E5E3DD] bg-[#FBFAF7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40">Rituel</p>
            <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">{dayOracle.dailyRitual}</p>
          </div>
        </div>
        {dayOracle.day_calc_steps && (
          <VibrationCalcBlock type="daily" steps={dayOracle.day_calc_steps} />
        )}
      </section>

      {/* Vibration du prénom */}
      {firstName && nameVib ? (
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7C3AED]">
            Vibration du prénom
          </p>
          <div className="flex items-center gap-5 border-l-2 border-[#7C3AED] pl-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/10 text-2xl font-bold text-[#7C3AED]">
              {nameVib}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
                {firstName}
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-xl font-medium text-[#1A1A1A]">
                {nameTitle}
              </p>
              <p className="text-sm text-[#1A1A1A]/50">{nameKeyword}</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-4 border border-dashed border-[#E5E3DD] bg-[#FBFAF7] p-8">
          <p className="text-sm text-[#1A1A1A]/60">
            Enregistre ton prénom dans ton profil pour découvrir ta vibration nominale.
          </p>
        </section>
      )}

      {/* Chemin de vie */}
      {lifePath !== null ? (
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7C3AED]">
            Chemin de vie
          </p>
          <div className="flex items-center gap-5 border-l-2 border-[#C9A961] pl-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A961]/10 text-2xl font-bold text-[#C9A961]">
              {lifePath}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A961]">
                Ton nombre maître de vie
              </p>
              <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
                Le chemin de vie se calcule à partir de la somme de ta date de naissance. Il révèle ta mission et tes forces profondes.
              </p>
            </div>
          </div>
          {lifePathSteps.length > 0 && (
            <VibrationCalcBlock type="personal" lifePathSteps={lifePathSteps} />
          )}
        </section>
      ) : (
        <section className="space-y-4 border border-dashed border-[#E5E3DD] bg-[#FBFAF7] p-8">
          <p className="text-sm text-[#1A1A1A]/60">
            Enregistre ta date de naissance dans ton{" "}
            <Link href="/mon-espace/astrologie" className="underline underline-offset-2 text-[#7C3AED]">
              thème astral
            </Link>{" "}
            pour découvrir ton chemin de vie.
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-[#E5E3DD] pt-10 text-center">
        <p className="text-sm text-[#1A1A1A]/60">
          Approfondis ta numérologie avec les modules Comprendre
        </p>
        <Link
          href="/comprendre"
          className="mt-4 inline-block rounded-sm bg-[#7C3AED] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6D28D9]"
        >
          Explorer le portail Comprendre →
        </Link>
      </section>
    </div>
  );
}
