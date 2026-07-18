import {
  getDueReview,
  getLowHalfLife,
} from "../../repositories/student/studentRecom.repository.js";

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
