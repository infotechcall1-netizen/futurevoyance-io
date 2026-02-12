import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { redis } from "@/lib/redis";
import { Resend } from "resend";

export function getAuthOptions(): NextAuthOptions {
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const fromEmail = "no-reply@futurevoyance.io";
  const provider = EmailProvider({
    from: fromEmail,
    async sendVerificationRequest({ identifier, url }) {
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY is required for email sign-in");
      }
      const resend = new Resend(resendApiKey);
      const host = process.env.NEXTAUTH_URL || new URL(url).origin;
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
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: identifier,
        subject,
        text,
        html,
      });
      if (error) {
        throw new Error(`Resend send failed: ${error.message}`);
      }
    },
  });

  return {
    secret: process.env.NEXTAUTH_SECRET,
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
