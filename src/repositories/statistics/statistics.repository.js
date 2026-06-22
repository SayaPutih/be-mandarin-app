import prisma from "../../config/prisma.js";
import { getCurrentSystemDate } from "../system-config.repository.js";

export const getStatisticData = async (userId) => {
  const currentDate = await getCurrentSystemDate();

  const [totalLearnedWords, totalReviews, dueReviews, memoryStates, attempts] =
    await Promise.all([
      prisma.wordMemoryState.count({
        where: {
          userId,
        },
      }),

      prisma.flashCardAttemptLog.count({
        where: {
          flash: {
            userId,
          },
        },
      }),

      prisma.wordMemoryState.count({
        where: {
          userId,
          nextReviewAt: {
            lte: currentDate,
          },
        },
      }),

      prisma.wordMemoryState.findMany({
        where: {
          userId,
        },
        select: {
          predictedRecall: true,
          predictedHalfLife: true,
        },
      }),

      prisma.flashCardAttempt.findMany({
        where: {
          userId,
        },
        select: {
          totalReviews: true,
          correctReviews: true,
        },
      }),
    ]);

  return {
    totalLearnedWords,
    totalReviews,
    dueReviews,
    memoryStates,
    attempts,
  };
};
