import prisma from "../../config/prisma.js";

export const getStudents = async () => {
  return await prisma.user.findMany({
    where: {
      role: "USER",
    },
    include: {
      memoryStates: true,
    },
  });
};

export const getStudentById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      attempts: true,
      memoryStates: true,
    },
  });
};
 
export const getStudentRetention = async (userId) => {
  return await prisma.wordMemoryState.aggregate({
    where: {
      userId,
    },
    _avg: {
      predictedRecall: true,
      predictedHalfLife: true,
    },
  });
};

export const getStudentMasteredWords = async (userId) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      predictedRecall: {
        gte: 0.8,
      },
    },
    include: {
      word: true,
    },
  });
};

export const getStudentForgottenWords = async (userId) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
      predictedRecall: {
        lt: 0.5,
      },
    },
    include: {
      word: true,
    },
  });
};

export const getStudentReviewSchedule = async (userId) => {
  return await prisma.wordMemoryState.findMany({
    where: {
      userId,
    },
    include: {
      word: true,
    },
    orderBy: {
      nextReviewAt: "asc",
    },
  });
};


