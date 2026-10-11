-- CreateEnum
CREATE TYPE "GigWorkMode" AS ENUM ('ONLINE', 'ON_CAMPUS', 'HYBRID');

-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "whatYoullDo" TEXT,
ADD COLUMN     "workMode" "GigWorkMode";
