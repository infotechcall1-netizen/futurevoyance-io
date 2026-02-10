import Link from "next/link";

export default function OracleHeader() {
  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/95 text-slate-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-200">
          FutureVoyance • <span className="text-violet-300">Oracle IA</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-200/80">
          <Link href="/" className="hover:text-violet-200 transition-colors">
            Aujourd&apos;hui
          </Link>
          <Link href="/comprendre" className="hover:text-violet-200 transition-colors">
            Comprendre
          </Link>
          <Link href="/aimer" className="hover:text-violet-200 transition-colors">
            Aimer
          </Link>
          <Link href="/prevoir" className="hover:text-violet-200 transition-colors">
            Prévoir
          </Link>
          <Link href="/recevoir" className="hover:text-violet-200 transition-colors">
            Recevoir
          </Link>
          <Link href="/mon-oracle" className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-100 hover:bg-violet-500/20 transition-colors">
            Mon Oracle
          </Link>
        </nav>
      </div>
    </header>
  );
}
