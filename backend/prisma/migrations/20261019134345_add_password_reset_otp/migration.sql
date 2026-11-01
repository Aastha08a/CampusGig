-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_otp_code" TEXT,
ADD COLUMN     "reset_otp_expires_at" TIMESTAMP(3);
