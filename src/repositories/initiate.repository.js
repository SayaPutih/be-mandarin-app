import prisma from "../config/prisma.js";
import { getCurrentSystemDate } from "../repositories/system-config.repository.js";


export const GetMcOptions = async (id, limit) => {
  return await prisma.$queryRaw`
        select 
            meaning
        from "MandarinMeaning" 
        where "wordId" <> ${id}
        order by RANDOM() limit ${limit}
    `;
};


export const findUserFlashCardInteractionWords = async (userId) => {
  return await prisma.flashCardAttempt.findMany({
    where: {
      userId: userId,
    },
  });
};

export const GetInitiation = async (listWords, limit) => {
  return prisma.mandarinWord.findMany({
    where: {
      id: {
        notIn: listWords,
      },
    },

    include: {
      meanings: true,
    },

    orderBy: {
      lexicalDifficulty: "asc",
    },

    take: limit,
  });
};
