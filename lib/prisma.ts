import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In Prisma 7 + @prisma/adapter-neon 7.x, PrismaNeon is a factory.
// It takes a Pool config object (NOT a Pool instance) and creates
// the pool internally when Prisma calls adapter.connect().
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
