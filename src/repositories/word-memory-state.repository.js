import prisma from "../config/prisma.js";

export const findWordMemoryState = async (userId, wordId) => {
  console.log("Find Memory");

  return await prisma.wordMemoryState.findUnique({
    where: {
      userId_wordId: {
        userId,
        wordId,
      },
    },
  });
};

export const createWordMemoryState = async (
  userId,
  wordId
) => {

  console.log("Create Memory");

  return await prisma.wordMemoryState.create({
    data: {
      userId,
      wordId,
    },
  });
};


export const updateWordMemoryState = async (
  id,
  data
) => {

  console.log("Update Memory");

  return await prisma.wordMemoryState.update({
    where: {
      id,
    },
    data,
  });
};


export const getReviewWords = async (
  userId
) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        lte: new Date(),
      },
    },
  });
};