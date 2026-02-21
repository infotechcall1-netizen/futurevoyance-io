import Link from "next/link";
import { ReactNode } from "react";

type PortalCardProps = {
  href: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  accentColor?: string;
};

export default function PortalCard({ href, title, subtitle, icon, accentColor = "#7C3AED" }: PortalCardProps) {
  return (
    <Link
      href={href}
      className="fv-card group relative flex min-h-[240px] flex-col justify-between border-l-2 px-8 py-10 transition-all duration-200 hover:border-l-4"
      style={{ borderLeftColor: accentColor }}
    >
      <div className="space-y-5">
        <h3
          className="fv-title text-3xl font-semibold text-[#262626]"
        >
          {title}
        </h3>
        <p className="fv-muted text-sm leading-relaxed">
          {subtitle}
        </p>
      </div>
      
      <div 
        className="mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 group-hover:gap-3"
        style={{ color: accentColor }}
      >
        <span>Entrer</span>
        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
