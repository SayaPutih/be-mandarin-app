import prisma from "../config/prisma.js";

export const createFlashCardAttemptLog = async (flashCardAttemptId,isCorrect,answerTimeMs) => {

  console.log("Create Log");
  let attemptLog = await prisma.flashCardAttemptLog.create({
    data: {
      flashcardAttemptId: flashCardAttemptId,
      isCorrect,
      answerTimeMs,
    },
  });

  return attemptLog.id;
};
