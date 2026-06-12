-- CreateTable
CREATE TABLE "mandarin_words" (
    "id" TEXT NOT NULL,
    "simplified" TEXT NOT NULL,
    "traditional" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "zhuyin" TEXT,
    "meaning" TEXT NOT NULL,
    "hsk_level" TEXT NOT NULL,
    "hsk_level_main" TEXT NOT NULL,
    "pos" TEXT,
    "frequency_hsk" BIGINT NOT NULL,
    "frequency_rank_hsk" INTEGER NOT NULL,
    "frequency_subtlex" DOUBLE PRECISION,
    "frequency_rank_subtlex" INTEGER,
    "per_million" DOUBLE PRECISION,
    "log_frequency" DOUBLE PRECISION,
    "context_diversity" DOUBLE PRECISION,
    "context_diversity_pct" DOUBLE PRECISION,
    "log_context_diversity" DOUBLE PRECISION,
    "in_subtlex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mandarin_words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mandarin_words_simplified_idx" ON "mandarin_words"("simplified");

-- CreateIndex
CREATE INDEX "mandarin_words_hsk_level_main_idx" ON "mandarin_words"("hsk_level_main");

-- CreateIndex
CREATE INDEX "mandarin_words_frequency_rank_hsk_idx" ON "mandarin_words"("frequency_rank_hsk");
