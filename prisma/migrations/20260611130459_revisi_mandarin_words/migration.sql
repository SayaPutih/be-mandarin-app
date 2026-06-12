/*
  Warnings:

  - You are about to drop the `mandarin_words` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FlashCardAttempt" DROP CONSTRAINT "FlashCardAttempt_wordId_fkey";

-- DropTable
DROP TABLE "mandarin_words";

-- CreateTable
CREATE TABLE "MandarinWord" (
    "id" TEXT NOT NULL,
    "simplified" TEXT NOT NULL,
    "traditional" TEXT,
    "pinyin" TEXT NOT NULL,
    "pos" TEXT,
    "hskLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MandarinWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandarinMeaning" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "def_frequency" INTEGER NOT NULL,

    CONSTRAINT "MandarinMeaning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MandarinMeaning_wordId_idx" ON "MandarinMeaning"("wordId");

-- AddForeignKey
ALTER TABLE "MandarinMeaning" ADD CONSTRAINT "MandarinMeaning_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "MandarinWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashCardAttempt" ADD CONSTRAINT "FlashCardAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "MandarinWord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
