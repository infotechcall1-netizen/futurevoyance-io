-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "stripeCustomerId"   TEXT UNIQUE,
  ADD COLUMN "subscriptionId"     TEXT UNIQUE,
  ADD COLUMN "subscriptionStatus" TEXT,
  ADD COLUMN "subscriptionPlanId" TEXT,
  ADD COLUMN "subscriptionEnd"    TIMESTAMP(3);
