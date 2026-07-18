import prisma from "../../config/prisma.js";

export const getDueReview = async (userId) => {
  const now = new Date();

  const next7Days = new Date();

  next7Days.setDate(next7Days.getDate() + 7);

  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        gte: now,
        lte: next7Days,
      },
    },

    include: {
      word: {
        include: {
          meanings: true,

          attempts: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });
};

export const getLowHalfLife = async (userId) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      predictedHalfLife: {
        not: null,
      },
    },

    include: {
      word: {
        include: {
          meanings: true,
        },
      },
    },

    orderBy: {
      predictedHalfLife: "asc",
    },

    take: 10,
  });
};
