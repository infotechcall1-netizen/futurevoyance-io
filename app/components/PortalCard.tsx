import Link from "next/link";
import { ReactNode } from "react";

type PortalCardProps = {
  href: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
};

export default function PortalCard({ href, title, subtitle, icon }: PortalCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl border border-violet-500/20 bg-slate-900/60 px-5 py-5 shadow-[0_0_40px_rgba(88,28,135,0.25)] ring-1 ring-slate-50/5 backdrop-blur-md transition transform hover:-translate-y-1 hover:border-violet-400/60 hover:ring-violet-300/40"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-violet-200/90">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_0.6rem_rgba(196,181,253,0.9)]" />
        Porte
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
          <p className="mt-1 text-sm text-slate-300/80">{subtitle}</p>
        </div>
        {icon && (
          <div className="text-violet-200 group-hover:text-violet-100">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-violet-200/80">
        <span className="h-px w-6 bg-violet-300/80" />
        Ouvrir la porte
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-violet-200/0 group-hover:border-violet-200/20 group-hover:shadow-[0_0_60px_rgba(196,181,253,0.35)]" />
    </Link>
  );
}
