/*
  Warnings:

  - You are about to drop the column `defFrequency` on the `MandarinWord` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `MandarinWord` table. All the data in the column will be lost.
  - You are about to drop the column `simplifiedNormalized` on the `MandarinWord` table. All the data in the column will be lost.
  - You are about to drop the column `traditional` on the `MandarinWord` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `WordMemoryState` table. All the data in the column will be lost.
  - You are about to drop the `MandarinSentence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MandarinSubtlex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SentenceAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MandarinSubtlex" DROP CONSTRAINT "MandarinSubtlex_wordId_fkey";

-- DropForeignKey
ALTER TABLE "SentenceAttempt" DROP CONSTRAINT "SentenceAttempt_sentenceId_fkey";

-- DropForeignKey
ALTER TABLE "SentenceAttempt" DROP CONSTRAINT "SentenceAttempt_userId_fkey";

-- AlterTable
ALTER TABLE "MandarinWord" DROP COLUMN "defFrequency",
DROP COLUMN "difficulty",
DROP COLUMN "simplifiedNormalized",
DROP COLUMN "traditional",
ADD COLUMN     "lexicalDifficulty" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WordMemoryState" DROP COLUMN "difficulty",
ADD COLUMN     "wordDifficulty" DOUBLE PRECISION;

-- DropTable
DROP TABLE "MandarinSentence";

-- DropTable
DROP TABLE "MandarinSubtlex";

-- DropTable
DROP TABLE "SentenceAttempt";

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" UUID NOT NULL,
    "currentReviewDate" TIMESTAMP(6),

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
