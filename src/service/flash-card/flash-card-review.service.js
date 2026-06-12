import {
  GetReviewWords,
  GetMcOptions,
} from "../../repositories/flash-card/flash-card-question.repository.js";

import { shuffle } from "../../utils/shuffle.js";

export const getReviewQuestionService = async (userId) => {
  const reviews = await GetReviewWords(userId);

  return {
    totalDue: reviews.length,

    words: reviews.map((r) => ({
      id: r.word.id,

      hanzi: r.word.simplified,

      pinyin: r.word.pinyin,

      meanings: r.word.meanings.map((m) => m.meaning),

      reviewCount: r.reviewCount,

      predictedRecall: r.predictedRecall,

      nextReviewAt: r.nextReviewAt,

      overdueDays: r.nextReviewAt
        ? Math.max(
            0,
            Math.floor(
              (Date.now() - r.nextReviewAt.getTime()) / (1000 * 60 * 60 * 24),
            ),
          )
        : 0,
    })),
  };
};