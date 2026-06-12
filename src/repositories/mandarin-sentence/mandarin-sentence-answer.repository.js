import prisma from "../../config/prisma.js"

export const createSentenceAttempt = async ({
  sentenceId,
  userId,
  scoring,
  isCorrect,
  userAnswer,
  aiFeedback,
}) => {
  console.log("----createSentenceAttempt----");
  console.log({
    sentenceId,
    userId,
    scoring,
    isCorrect,
    userAnswer,
    aiFeedback,
  });

  return await prisma.sentenceAttempt.create({
    data: { sentenceId, userId, scoring, isCorrect, userAnswer, aiFeedback },
  });
};