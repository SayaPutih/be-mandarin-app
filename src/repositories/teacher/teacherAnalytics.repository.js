import prisma from "../../config/prisma.js";

export const getRetentionAnalytics = async () => {
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

export const getHardestVocabulary = async () => {
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

export const getHSKDistribution = async () => {
  return await prisma.mandarinWord.groupBy({
    by: ["hskLevel"],
    _count: true,
  });
};
