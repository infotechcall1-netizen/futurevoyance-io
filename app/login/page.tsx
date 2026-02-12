import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion • FutureVoyance",
  description: "Connecte-toi avec un lien magique envoyé par email.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; check?: string }>;
};

function safeCallbackUrl(input?: string): string {
  if (!input) return "/mon-oracle";
  return input.startsWith("/") ? input : "/mon-oracle";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const showCheckMessage = params.check === "1";

  const session = await getServerAuthSession();
  if (session?.user?.email) {
    redirect(callbackUrl);
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Se connecter</h1>
        <p className="text-sm text-slate-300/90">
          Recois un lien magique par email pour acceder a ton espace Oracle.
        </p>
      </div>

      {showCheckMessage && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">
          Verifie ta boite mail et clique sur le lien de connexion.
        </p>
      )}

      <LoginForm callbackUrl={callbackUrl} />

      <p className="text-xs text-slate-400">
        <Link href="/" className="underline hover:text-slate-300">
          Retour a l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
