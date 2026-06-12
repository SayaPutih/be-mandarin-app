-- CreateTable
CREATE TABLE "MandarinSentence" (
    "id" TEXT NOT NULL,
    "englishTranslation" TEXT NOT NULL,
    "hskLevel" INTEGER NOT NULL,
    "mandarinText" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,

    CONSTRAINT "MandarinSentence_pkey" PRIMARY KEY ("id")
);
