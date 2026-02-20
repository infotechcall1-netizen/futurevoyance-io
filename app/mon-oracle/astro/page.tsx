import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateNatalChart } from "@/lib/astrology/engine";
import AstroPageClient from "@/app/components/astrology/AstroPageClient";

export const metadata: Metadata = {
  title: "Mon Thème Astral | FutureVoyance",
  description:
    "Découvre la carte du ciel au moment de ta naissance : ascendant, positions planétaires et interprétation personnalisée.",
};

export const dynamic = "force-dynamic";

export default async function AstroPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/mon-oracle/astro");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      birthDate: true,
      birthCity: true,
      birthLat: true,
      birthLon: true,
      birthTimezone: true,
    },
  });

  const hasBirthData =
    !!user?.birthDate && user.birthLat != null && user.birthLon != null;

  let chart = null;
  if (hasBirthData && user.birthDate && user.birthLat != null && user.birthLon != null) {
    chart = generateNatalChart(
      user.name ?? "",
      user.birthDate,
      user.birthLat,
      user.birthLon,
      user.birthCity ?? "",
      user.birthTimezone ?? "UTC"
    );
  }

  return (
    <div className="space-y-16">
      <header className="space-y-5">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold tracking-tight text-[#1A1A1A] md:text-5xl">
          Mon Thème Astral
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#1A1A1A]/70">
          La carte du ciel au moment de ta naissance révèle ta signature
          énergétique unique. Entre tes coordonnées de naissance pour découvrir
          ton ascendant, tes positions planétaires et ton chemin de lumière.
        </p>
      </header>

      <AstroPageClient initialChart={chart} hasBirthData={hasBirthData} />
    </div>
  );
}
