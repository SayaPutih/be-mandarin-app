import prisma from "../../config/prisma.js";

export const getReviewedWords = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.flashCardAttempt.count({
      where: {
        userId,
      },
    }),

    prisma.flashCardAttempt.findMany({
      where: {
        userId,
      },
      include: {
        word: {
          include: {
            meanings: true,
          },
        },
      },
      orderBy: {
        totalReviews: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
