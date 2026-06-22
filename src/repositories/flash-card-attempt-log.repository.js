import prisma from "../config/prisma.js";

export const createFlashCardAttemptLog = async (flashCardAttemptId,isCorrect,answerTimeMs,dateManipulation) => {

  console.log("Create Log");
  let attemptLog = await prisma.flashCardAttemptLog.create({
    data: {
      flashcardAttemptId: flashCardAttemptId,
      isCorrect,
      answerTimeMs,
      createdAt: dateManipulation,
    },
  });

  return attemptLog.id;
};

