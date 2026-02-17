import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import AuthForm from "./AuthForm";

export const metadata: Metadata = {
  title: "Connexion • FutureVoyance",
  description: "Connecte-toi ou crée ton compte pour accéder à ton Oracle personnel.",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

function safeCallbackUrl(input?: string): string {
  if (!input) return "/mon-oracle";
  return input.startsWith("/") ? input : "/mon-oracle";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const error = params.error;

  const session = await getServerAuthSession();
  if (session?.user?.email) {
    redirect(callbackUrl);
  }

  return (
    <div className="mx-auto max-w-md space-y-8 border-l-2 border-[#6e4efb] bg-[#FBFAF7] px-8 py-10">
      <div className="space-y-3">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[#1A1A1A]">
          Bienvenue
        </h1>
        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
          Connecte-toi ou crée ton compte pour accéder à ton Oracle personnel.
        </p>
      </div>

      {error && (
        <p className="rounded-sm border border-rose-600/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error === "CredentialsSignin"
            ? "Email ou mot de passe incorrect."
            : error === "OAuthSignin"
            ? "Erreur lors de la connexion OAuth."
            : "Une erreur est survenue, réessaie."}
        </p>
      )}

      <AuthForm callbackUrl={callbackUrl} />

      <p className="text-xs text-[#1A1A1A]/50">
        <Link href="/" className="underline decoration-[#6e4efb]/40 underline-offset-4 hover:text-[#1A1A1A]">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
