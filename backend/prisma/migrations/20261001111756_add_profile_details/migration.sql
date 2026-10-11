-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "stream" TEXT,
ADD COLUMN     "university" TEXT NOT NULL DEFAULT 'Chitkara University',
ADD COLUMN     "year" INTEGER;
