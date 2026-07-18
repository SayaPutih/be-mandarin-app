import prisma from "../../config/prisma.js";

export const getCalendar = async (userId, start, end) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        gte: new Date(start),
        lte: new Date(end),
      },
    },
    select: {
      nextReviewAt: true,
    },
  });
};

export const getCalendarDetail = async (userId, dateStr) => {
  const start = new Date(`${dateStr}T00:00:00`);

  const end = new Date(`${dateStr}T23:59:59`);

  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        gte: start,
        lte: end,
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
      nextReviewAt: "asc",
    },
  });
};
