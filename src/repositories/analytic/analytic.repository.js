import prisma from "../../config/prisma.js";

export const getAnalyticsOverview = async (userId) => {
  const learnedWords = await prisma.wordMemoryState.count({
    where: {
      userId,
    },
  });

  const reviews = await prisma.flashCardAttempt.aggregate({
    where: {
      userId,
    },
    _sum: {
      totalReviews: true,
    },
  });

  const memory = await prisma.wordMemoryState.aggregate({
    where: {
      userId,
    },
    _avg: {
      predictedHalfLife: true,
      predictedRecall: true,
    },
  });

  return {
    learnedWords,
    totalReviews: reviews._sum.totalReviews ?? 0,

    averageHalfLife: memory._avg.predictedHalfLife ?? 0,

    averageRecall: (memory._avg.predictedRecall ?? 0) * 100,
  };
};

export const getDifficultyDistribution = async (userId) => {
  const words = await prisma.wordMemoryState.findMany({
    where: {
      userId,
    },
    select: {
      wordDifficulty: true,
    },
  });

  let easy = 0;
  let medium = 0;
  let hard = 0;

  words.forEach((w) => {
    const d = w.wordDifficulty ?? 0;

    if (d <= 0.33) easy++;
    else if (d <= 0.66) medium++;
    else hard++;
  });

  return {
    easy,
    medium,
    hard,
  };
};

export const getRecentActivity = async (userId) => {
  return prisma.flashCardAttemptLog.findMany({
    take: 20,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      flash: {
        include: {
          word: true,
        },
      },
    },

    where: {
      flash: {
        userId,
      },
    },
  });
};

export const getWordProgress = async (userId) => {
  return prisma.wordMemoryState.findMany({
    where: {
      userId,
    },

    include: {
      word: true,
    },

    orderBy: {
      predictedHalfLife: "desc",
    },
  });
};
