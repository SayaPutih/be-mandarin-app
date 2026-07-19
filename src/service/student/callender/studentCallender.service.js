import {
  getDueReview,
  getLowHalfLife,
} from "../../../repositories/student/studentRecom.repository.js";

import {
  getCalendar,
  getCalendarDetail,
} from "../../../repositories/student/studentSchedule.repository.js";

export const getCalendarService = async (userId, start, end) => {
  const reviews = await getCalendar(userId, start, end);

  const grouped = {};

  reviews.forEach((item) => {
    const date = item.nextReviewAt.toISOString().split("T")[0];

    grouped[date] = (grouped[date] || 0) + 1;
  });

  return grouped;
};

export const getCalendarDetailService = async (userId, dateStr) => {
  const reviews = await getCalendarDetail(userId, dateStr);

  return reviews.map((item) => ({
    id: item.id,
    wordId: item.word.id,
    simplified: item.word.simplified,
    pinyin: item.word.pinyin_tone,
    hskLevel: item.word.hskLevel,
    meanings: item.word.meanings,
    nextReviewAt: item.nextReviewAt,
    predictedHalfLife: item.predictedHalfLife,
  }));
};


export const getRecommendationService = async (userId) => {
  const now = new Date();

  const [dueReview, lowHalfLife] = await Promise.all([
    getDueReview(userId),
    getLowHalfLife(userId),
  ]);

  const dueReviewMapped = dueReview.map((item) => {
    const diffDays = Math.ceil(
      (new Date(item.nextReviewAt).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return {
      ...item,

      dueInDays: diffDays,

      correctReviews: item.word.attempts?.[0]?.correctReviews ?? 0,

      totalReviews: item.word.attempts?.[0]?.totalReviews ?? 0,
    };
  });

  return {
    dueReview: dueReviewMapped,
    lowHalfLife,
  };
};
