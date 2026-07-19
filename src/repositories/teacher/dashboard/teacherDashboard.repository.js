import prisma from "../../../config/prisma.js";

export const getTeacherDashboardRepository = async () => {
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

export const getCountMandarinWordsRepository = async()=>{
  return await prisma.mandarinWord.count();
}

export const CountDistinctHskLevelsRepository = async () => {
  const levels = await prisma.mandarinWord.groupBy({
    by: ["hskLevel"],
  });

  return levels.length;
};

export const getCountMandarinMeaningRepository = async () => {
  return await prisma.mandarinMeaning.count();
};

