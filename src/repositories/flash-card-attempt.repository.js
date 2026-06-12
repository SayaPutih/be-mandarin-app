import prisma from "../config/prisma.js";

export const findFlashCardAttempt = async (userId, wordId) => {
  console.log("Find Attempt");

  return await prisma.flashCardAttempt.findUnique({
    where: {
      userId_wordId: {
        userId,
        wordId,
      },
    },
  });
};

export const createFlashCardAttempt = async (
  userId,
  wordId
) => {

  console.log("Create Attempt");

  const attempt = await prisma.flashCardAttempt.create({
    data: {
      userId,
      wordId,
    },
  });

  return attempt;
};


export const updateFlashCardAttempt = async (
  id,
  data
) => {

  console.log("Update Attempt");
  return await prisma.flashCardAttempt.update({
    where: {
      id,
    },
    data,
  });
};