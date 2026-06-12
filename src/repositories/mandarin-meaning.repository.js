import prisma from "../config/prisma.js";

export const getMandarinMeaningbyWordId = async (wordId) => {
  return prisma.mandarinMeaning.findMany({
    where: {
      wordId,
    },
  });
};
