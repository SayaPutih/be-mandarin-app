/*
  Warnings:

  - You are about to drop the `UserWordFlashCardAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserWordFlashCardAttempt" DROP CONSTRAINT "UserWordFlashCardAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWordFlashCardAttempt" DROP CONSTRAINT "UserWordFlashCardAttempt_wordId_fkey";

-- DropTable
DROP TABLE "UserWordFlashCardAttempt";

-- CreateTable
CREATE TABLE "FlashCardAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answerTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlashCardAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlashCardAttempt_userId_idx" ON "FlashCardAttempt"("userId");

-- CreateIndex
CREATE INDEX "FlashCardAttempt_wordId_idx" ON "FlashCardAttempt"("wordId");

-- AddForeignKey
ALTER TABLE "FlashCardAttempt" ADD CONSTRAINT "FlashCardAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCardAttempt" ADD CONSTRAINT "FlashCardAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "mandarin_words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
