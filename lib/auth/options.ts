import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { redis } from "@/lib/redis";
import { Resend } from "resend";

export function getAuthOptions(): NextAuthOptions {
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const nextAuthUrl = (process.env.NEXTAUTH_URL || "").trim();
  const nextAuthSecret = (process.env.NEXTAUTH_SECRET || "").trim();
  
  // Logs de diagnostic (sans afficher les secrets)
  console.log("[auth] Configuration check:", {
    hasResendApiKey: !!resendApiKey,
    resendApiKeyLength: resendApiKey ? resendApiKey.length : 0,
    nextAuthUrl: nextAuthUrl || "(not set)",
    hasNextAuthSecret: !!nextAuthSecret,
    nextAuthSecretLength: nextAuthSecret ? nextAuthSecret.length : 0,
    nodeEnv: process.env.NODE_ENV,
  });

  const fromEmail = "no-reply@futurevoyance.io";
  const provider = EmailProvider({
    from: fromEmail,
    async sendVerificationRequest({ identifier, url }) {
      console.log("[auth] sendVerificationRequest called:", {
        to: identifier,
        urlOrigin: new URL(url).origin,
        urlPath: new URL(url).pathname,
        hasResendApiKey: !!resendApiKey,
      });

      if (!resendApiKey) {
        console.error("[auth] RESEND_API_KEY is missing");
        throw new Error("RESEND_API_KEY is required for email sign-in");
      }
      
      const resend = new Resend(resendApiKey);
      const host = nextAuthUrl || new URL(url).origin;
      const subject = `Connexion a ${new URL(host).hostname}`;
      const text = `Connecte-toi a FutureVoyance:\n${url}\n\nSi tu n'es pas a l'origine de cette demande, ignore cet email.`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111">
          <h2>Connexion a FutureVoyance</h2>
          <p>Clique sur le bouton ci-dessous pour te connecter.</p>
          <p style="margin:24px 0;">
            <a href="${url}" style="background:#7c3aed;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
              Se connecter
            </a>
          </p>
          <p>Ou copie ce lien:</p>
          <p><a href="${url}">${url}</a></p>
        </div>
      `;
      
      console.log("[auth] Sending email via Resend:", {
        from: fromEmail,
        to: identifier,
        subject,
      });

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: identifier,
        subject,
        text,
        html,
      });
      
      if (error) {
        console.error("[auth] Resend error:", error);
        throw new Error(`Resend send failed: ${error.message}`);
      }
      
      console.log("[auth] Email sent successfully to", identifier);
    },
  });

  if (!nextAuthSecret) {
    console.error("[auth] NEXTAUTH_SECRET is missing");
    throw new Error("NEXTAUTH_SECRET is required for NextAuth");
  }

  return {
    secret: nextAuthSecret,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
      verifyRequest: "/login?check=1",
    },
    adapter: UpstashRedisAdapter(redis),
    providers: [provider],
  } satisfies NextAuthOptions;
}
