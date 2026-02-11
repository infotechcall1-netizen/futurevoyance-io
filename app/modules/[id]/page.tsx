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
    <div className="space-y-8">
      <div className="space-y-2">
        <Link
          href={`/${module.portal_id}`}
          className="text-xs font-medium uppercase tracking-[0.2em] text-violet-200/80 hover:text-violet-200"
        >
          ← {module.portal_id}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          {module.title}
        </h1>
        <p className="text-sm text-slate-300/90">{module.description}</p>
        {module.isPremium && (
          <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200">
            Premium
          </span>
        )}
      </div>

      <ModuleGate module={module} />
    </div>
  );
}
