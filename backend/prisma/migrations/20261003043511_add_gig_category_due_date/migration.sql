-- CreateEnum
CREATE TYPE "GigCategory" AS ENUM ('DESIGN', 'CODING', 'CONTENT', 'EVENTS', 'TUTORING', 'MARKETING');

-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "category" "GigCategory",
ADD COLUMN     "dueDate" TIMESTAMP(3);
