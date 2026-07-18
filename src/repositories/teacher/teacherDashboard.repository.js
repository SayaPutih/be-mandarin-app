import prisma from "../../config/prisma.js";

export const getTeacherDashboard = async () => {
  const [totalStudents, totalVocabulary, totalReviewsToday, avgRetention] =
    await Promise.all([
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.mandarinWord.count(),

      prisma.flashCardAttempt.aggregate({
        _sum: {
          totalReviews: true,
        },
      }),

      prisma.wordMemoryState.aggregate({
        _avg: {
          predictedRecall: true,
        },
      }),
    ]);

  return {
    totalStudents,
    totalVocabulary,
    totalReviewsToday: totalReviewsToday._sum.totalReviews || 0,

    averageRetention: avgRetention._avg.predictedRecall || 0,
  };
};
