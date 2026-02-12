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
      className="group flex flex-col border-l-2 border-[#7C3AED] bg-[#FBFAF7] p-6 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#7C3AED]">{module.title}</h3>
        {module.isPremium && (
          <span className="rounded-sm border border-[#C9A961]/40 bg-[#C9A961]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#C9A961]">
            Premium
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">{module.description}</p>
    </Link>
  );
}
