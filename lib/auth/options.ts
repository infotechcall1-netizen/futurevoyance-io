import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { redis } from "@/lib/redis";

export function getAuthOptions(): NextAuthOptions {
  const provider = EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
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
