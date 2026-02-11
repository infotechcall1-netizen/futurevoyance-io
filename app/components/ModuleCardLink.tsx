"use client";

import Link from "next/link";
import type { ModuleDef } from "@/lib/oracle/modules";
import { trackEvent } from "@/lib/analytics/track";

type ModuleCardLinkProps = {
  module: ModuleDef;
};

export default function ModuleCardLink({ module }: ModuleCardLinkProps) {
  return (
    <Link
      href={`/modules/${module.id}`}
      onClick={() => {
        trackEvent("click_portal_module", {
          portal_id: module.portal_id,
          module_id: module.id,
          is_premium: module.isPremium,
        });
      }}
      className="group flex flex-col rounded-2xl border border-violet-500/20 bg-slate-950/60 p-5 transition hover:border-violet-400/50 hover:bg-slate-900/60"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-50">{module.title}</h3>
        {module.isPremium && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-200">
            Premium
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-300/90">{module.description}</p>
    </Link>
  );
}
