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


export const findUserFlashCardInteraction = async (userId) => {
  return await prisma.flashCardAttempt.count({
    where: {
      userId: userId,
    },
  });
};

export const findUserFlashCardInteractionWords = async (userId) => {
  return await prisma.flashCardAttempt.findMany({
    where: {
      userId: userId,
    },
  });
};


export const createFlashCardAttempt = async (userId, wordId, dateManipulation) => {
  console.log("Create Attempt");

  const attempt = await prisma.flashCardAttempt.create({
    data: {
      userId,
      wordId,
      createdAt: dateManipulation,
      lastReviewedAt : dateManipulation,
      updatedAt : dateManipulation,
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