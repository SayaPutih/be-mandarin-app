import {
  getAnalyticsOverview,
  getDifficultyDistribution,
  getRecentActivity,
  getWordProgress,
} from "../../../repositories/analytic/analytic.repository.js";

export const analyticsOverviewService = async (userId) => {
  return getAnalyticsOverview(userId);
};

export const analyticsDifficultyService = async (userId) => {
  return getDifficultyDistribution(userId);
};

export const analyticsRecentService = async (userId) => {
  const data = await getRecentActivity(userId);

  return data.map((item) => ({
    id: item.id,

    hanzi: item.flash.word.simplified,

    isCorrect: item.isCorrect,

    answerTimeMs: item.answerTimeMs,

    createdAt: item.createdAt,
  }));
};

export const analyticsWordProgressService = async (userId) => {
  const data = await getWordProgress(userId);

  return data.map((item) => ({
    wordId: item.word.id,

    hanzi: item.word.simplified,

    pinyin: item.word.pinyin,

    difficulty: item.difficulty,

    halfLife: item.predictedHalfLife,

    recall: item.predictedRecall,

    reviewCount: item.reviewCount,

    nextReviewAt: item.nextReviewAt,
  }));
};
