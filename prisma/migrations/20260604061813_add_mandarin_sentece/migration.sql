-- CreateTable
CREATE TABLE "SentenceAttempt" (
    "id" TEXT NOT NULL,
    "sentenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scoring" INTEGER NOT NULL,
    "isCorrect" BOOLEAN,
    "userAnswer" TEXT NOT NULL,
    "aiFeedback" TEXT NOT NULL,

    CONSTRAINT "SentenceAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SentenceAttempt_userId_idx" ON "SentenceAttempt"("userId");

-- CreateIndex
CREATE INDEX "SentenceAttempt_sentenceId_idx" ON "SentenceAttempt"("sentenceId");

-- AddForeignKey
ALTER TABLE "SentenceAttempt" ADD CONSTRAINT "SentenceAttempt_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "MandarinSentence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentenceAttempt" ADD CONSTRAINT "SentenceAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
