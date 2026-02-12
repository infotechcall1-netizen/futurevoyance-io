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
  searchParams: Promise<{ callbackUrl?: string; check?: string; error?: string }>;
};

function safeCallbackUrl(input?: string): string {
  if (!input) return "/mon-oracle";
  return input.startsWith("/") ? input : "/mon-oracle";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const showCheckMessage = params.check === "1";
  const showSigninError = params.error === "EmailSignin";

  const session = await getServerAuthSession();
  if (session?.user?.email) {
    redirect(callbackUrl);
  }

  return (
    <div className="mx-auto max-w-md space-y-8 border-l-2 border-[#7C3AED] bg-[#FBFAF7] px-8 py-10">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#1A1A1A]">Se connecter</h1>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Reçois un lien magique par email pour accéder à ton espace Oracle.
        </p>
      </div>

      {showCheckMessage && (
        <p className="rounded-sm border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Lien envoyé. Vérifie ta boîte mail et clique sur le lien de connexion.
        </p>
      )}
      {showSigninError && (
        <p className="rounded-sm border border-rose-600/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          Erreur d&apos;envoi du lien magique, réessaie dans un instant.
        </p>
      )}

      <LoginForm callbackUrl={callbackUrl} />

      <p className="text-xs text-[#1A1A1A]/50">
        <Link href="/" className="underline decoration-[#7C3AED]/40 underline-offset-4 hover:text-[#1A1A1A]">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
