/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWordFlashCardAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answerTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWordFlashCardAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserWordFlashCardAttempt_userId_idx" ON "UserWordFlashCardAttempt"("userId");

-- CreateIndex
CREATE INDEX "UserWordFlashCardAttempt_wordId_idx" ON "UserWordFlashCardAttempt"("wordId");

-- AddForeignKey
ALTER TABLE "UserWordFlashCardAttempt" ADD CONSTRAINT "UserWordFlashCardAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWordFlashCardAttempt" ADD CONSTRAINT "UserWordFlashCardAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "mandarin_words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
