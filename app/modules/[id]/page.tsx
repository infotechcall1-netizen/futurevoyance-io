import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MODULES } from "@/lib/oracle/modules";
import ModuleGate from "./ModuleGate";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const module = MODULES.find((m) => m.id === id);
  if (!module) return { title: "Module | FutureVoyance" };
  return {
    title: `${module.title} • ${module.portal_id} | FutureVoyance`,
    description: module.description,
  };
}

export default async function ModulePage({ params }: Props) {
  const { id } = await params;
  const module = MODULES.find((m) => m.id === id);
  if (!module) notFound();

  return (
    <div className="space-y-12">
      <div className="space-y-5 border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-8 py-8">
        <Link
          href={`/${module.portal_id}`}
          className="text-xs font-medium uppercase tracking-[0.25em] text-[#C9A961] transition-colors hover:text-[#1A1A1A]"
        >
          ← {module.portal_id}
        </Link>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold tracking-tight text-[#1A1A1A] md:text-4xl">
          {module.title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[#1A1A1A]/70">{module.description}</p>
        {module.isPremium && (
          <span className="inline-block rounded-sm border border-[#C9A961]/40 bg-[#C9A961]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#C9A961]">
            Premium
          </span>
        )}
      </div>

      <ModuleGate module={module} />
    </div>
  );
}
