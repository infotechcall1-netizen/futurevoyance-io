import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import OracleChat from "@/app/components/OracleChat";

export const metadata: Metadata = {
  title: "Mon Oracle | FutureVoyance",
  description:
    "Pose tes questions à l'Oracle personnel. Chaque réponse intègre ta numérologie et ton thème astral.",
};
export const dynamic = "force-dynamic";

export default async function MonOraclePage() {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/mon-espace/oracle");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { firstName: true, name: true },
  });

  const firstName = user?.firstName || user?.name?.split(" ")[0] || undefined;

  return (
    <div className="space-y-10">
      <header className="space-y-5">
        <Link
          href="/mon-espace"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70 transition-colors"
        >
          ← Mon Espace
        </Link>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Ton Oracle personnel
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-[#1A1A1A]/60">
          Chaque réponse intègre ta numérologie et ton thème astral.
        </p>
      </header>

      <OracleChat
        anonymous={false}
        firstName={firstName}
        placeholder={firstName ? `Pose ta question, ${firstName}…` : "Pose ta question…"}
      />
    </div>
  );
}
