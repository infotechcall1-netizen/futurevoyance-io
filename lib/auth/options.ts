import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NextAuth Configuration Options
 * 
 * SÉCURITÉ IMPORTANTE:
 * - Ce fichier s'exécute côté SERVEUR uniquement (API Routes)
 * - Les CLIENT_SECRET ne sont JAMAIS exposés au client/navigateur
 * - Les variables d'environnement doivent être configurées dans Vercel
 * - Google Callback URL: /api/auth/callback/google
 */
export function getAuthOptions(): NextAuthOptions {
  const nextAuthSecret = (process.env.NEXTAUTH_SECRET || "").trim();
  const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  const nextAuthUrl = (process.env.NEXTAUTH_URL || "").trim();

  console.log("[auth] Configuration check:", {
    hasNextAuthSecret: !!nextAuthSecret,
    nextAuthSecretLength: nextAuthSecret.length,
    hasGoogleOAuth: !!googleClientId && !!googleClientSecret,
    googleClientIdLength: googleClientId.length,
    googleSecretLength: googleClientSecret.length,
    nodeEnv: process.env.NODE_ENV,
    googleClientIdPrefix: googleClientId ? googleClientId.substring(0, 15) + "..." : "missing",
    googleSecretPrefix: googleClientSecret ? googleClientSecret.substring(0, 10) + "..." : "missing",
    nextAuthUrl: nextAuthUrl,
    nextAuthUrlLength: nextAuthUrl.length,
  });

  if (!nextAuthSecret) {
    console.error("[auth] NEXTAUTH_SECRET is missing");
    throw new Error("NEXTAUTH_SECRET is required for NextAuth");
  }

  const providers = [];

  // Google OAuth Provider
  // IMPORTANT: Ne JAMAIS exposer GOOGLE_CLIENT_SECRET côté client
  // Les secrets sont uniquement utilisés côté serveur (API Routes)
  if (googleClientId && googleClientSecret) {
    providers.push(
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    );
  }

  // Credentials Provider
  providers.push(
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        try {
          // Fetch user from Prisma
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          if (!user.passwordHash) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          // Return user (without passwordHash) - ensure email is not null
          return {
            id: user.id,
            name: user.name || "",
            email: user.email || email,
            image: user.image || "",
          };
        } catch (error) {
          console.error("[auth] Authorize error:", error);
          return null;
        }
      },
    })
  );

  return {
    debug: true,
    secret: nextAuthSecret,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    adapter: PrismaAdapter(prisma),
    providers,
    logger: {
      error(code, metadata) {
        console.error("[NextAuth Error]", code, JSON.stringify(metadata, null, 2));
      },
      warn(code) {
        console.warn("[NextAuth Warn]", code);
      },
      debug(code, metadata) {
        console.log("[NextAuth Debug]", code, metadata);
      },
    },
    events: {
      async signIn(message) {
        console.log("[NextAuth Event] signIn:", {
          user: message.user?.email,
          account: message.account?.provider,
          isNewUser: message.isNewUser,
        });
      },
      async signOut(message) {
        console.log("[NextAuth Event] signOut:", message);
      },
      async createUser(message) {
        console.log("[NextAuth Event] createUser:", {
          userId: message.user.id,
          email: message.user.email,
        });
      },
      async linkAccount(message) {
        console.log("[NextAuth Event] linkAccount:", {
          userId: message.user.id,
          provider: message.account.provider,
        });
      },
      async session(message) {
        console.log("[NextAuth Event] session:", {
          email: message.session?.user?.email,
        });
      },
    },
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Allow relative paths
        if (url.startsWith("/")) return baseUrl + url;
        // Allow same-origin redirects
        if (url.startsWith(baseUrl)) return url;
        // Fallback: prevent open redirects
        return baseUrl;
      },
      async signIn({ user, account, profile }) {
        console.log("[NextAuth Callback] signIn:", {
          userId: user?.id,
          userEmail: user?.email,
          accountProvider: account?.provider,
          accountType: account?.type,
          profileEmail: (profile as { email?: string })?.email,
        });
        return true;
      },
      async jwt({ token, user, account }) {
        // On first sign in, add user info to token
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        // Add user info to session
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.picture as string;
        }
        return session;
      },
    },
  } satisfies NextAuthOptions;
}
