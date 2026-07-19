import prisma from "../../../config/prisma.js";

export const getRetentionAnalyticsRepository = async () => {
  return await prisma.wordMemoryState.aggregate({
    _avg: {
      predictedRecall: true,
      predictedHalfLife: true,
    },
    _min: {
      predictedRecall: true,
    },
    _max: {
      predictedRecall: true,
    },
  });
};

export const getHardestVocabularyRepository = async () => {
  return await prisma.flashCardAttempt.findMany({
    include: {
      word: true,
    },
    orderBy: {
      correctReviews: "asc",
    },
    take: 20,
  });
};

export const getHSKDistributionRepository = async () => {
  return await prisma.mandarinWord.groupBy({
    by: ["hskLevel"],
    _count: true,
  });
};
