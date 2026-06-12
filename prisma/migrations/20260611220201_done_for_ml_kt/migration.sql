/*
  Warnings:

  - You are about to drop the column `answerTimeMs` on the `FlashCardAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `FlashCardAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `def_frequency` on the `MandarinWord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,wordId]` on the table `FlashCardAttempt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[simplified]` on the table `MandarinWord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FlashCardAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defFrequency` to the `MandarinWord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MandarinMeaning" DROP CONSTRAINT "MandarinMeaning_wordId_fkey";

-- AlterTable
ALTER TABLE "FlashCardAttempt" DROP COLUMN "answerTimeMs",
DROP COLUMN "isCorrect",
ADD COLUMN     "averageAnswerTimeMs" DOUBLE PRECISION,
ADD COLUMN     "correctReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAnswerCorrect" BOOLEAN,
ADD COLUMN     "lastReviewedAt" TIMESTAMP(3),
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MandarinWord" DROP COLUMN "def_frequency",
ADD COLUMN     "defFrequency" INTEGER NOT NULL,
ADD COLUMN     "radical" TEXT,
ADD COLUMN     "simplifiedNormalized" TEXT;

-- CreateTable
CREATE TABLE "MandarinSubtlex" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "wordRaw" TEXT,
    "length" INTEGER,
    "pinyin" TEXT,
    "pinyinInput" TEXT,
    "wCount" INTEGER,
    "wMillion" DOUBLE PRECISION,
    "log10W" DOUBLE PRECISION,
    "wCd" INTEGER,
    "wCdPercent" DOUBLE PRECISION,
    "log10CD" DOUBLE PRECISION,
    "dominantPos" TEXT,
    "dominantPosFreq" INTEGER,
    "allPos" TEXT,
    "allPosFreq" TEXT,
    "englishTranslate" TEXT,
    "wordNormalized" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MandarinSubtlex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashCardAttemptLog" (
    "id" TEXT NOT NULL,
    "flashcardAttemptId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answerTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlashCardAttemptLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordMemoryState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rHistory" TEXT,
    "tHistory" TEXT,
    "lastReviewAt" TIMESTAMP(3),
    "lastAnswerTimeMs" INTEGER,
    "averageAnswerTimeMs" DOUBLE PRECISION,
    "stability" DOUBLE PRECISION,
    "difficulty" DOUBLE PRECISION,
    "predictedRecall" DOUBLE PRECISION,
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordMemoryState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MandarinSubtlex_wordId_key" ON "MandarinSubtlex"("wordId");

-- CreateIndex
CREATE INDEX "FlashCardAttemptLog_flashcardAttemptId_idx" ON "FlashCardAttemptLog"("flashcardAttemptId");

-- CreateIndex
CREATE INDEX "WordMemoryState_userId_idx" ON "WordMemoryState"("userId");

-- CreateIndex
CREATE INDEX "WordMemoryState_wordId_idx" ON "WordMemoryState"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "WordMemoryState_userId_wordId_key" ON "WordMemoryState"("userId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "FlashCardAttempt_userId_wordId_key" ON "FlashCardAttempt"("userId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "MandarinWord_simplified_key" ON "MandarinWord"("simplified");

-- CreateIndex
CREATE INDEX "MandarinWord_hskLevel_idx" ON "MandarinWord"("hskLevel");

-- AddForeignKey
ALTER TABLE "MandarinMeaning" ADD CONSTRAINT "MandarinMeaning_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "MandarinWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandarinSubtlex" ADD CONSTRAINT "MandarinSubtlex_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "MandarinWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCardAttemptLog" ADD CONSTRAINT "FlashCardAttemptLog_flashcardAttemptId_fkey" FOREIGN KEY ("flashcardAttemptId") REFERENCES "FlashCardAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordMemoryState" ADD CONSTRAINT "WordMemoryState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordMemoryState" ADD CONSTRAINT "WordMemoryState_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "MandarinWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
