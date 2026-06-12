// import {
//   GetMcQuestion,
//   GetMcOptions,
// } from "../../repositories/flash-card.repository.js";

import { findUserById } from "../../repositories/user.repository.js";
import { predictHalfLife } from "../../ml/predict-half-life.js";
import { getMandarinWordById } from "../../repositories/mandarin-word.repository.js";

import {
  findFlashCardAttempt,
  createFlashCardAttempt,
  updateFlashCardAttempt,
} from "../../repositories/flash-card-attempt.repository.js";

import { createFlashCardAttemptLog } from "../../repositories/flash-card-attempt-log.repository.js";

import {
  findWordMemoryState,
  createWordMemoryState,
  updateWordMemoryState,
} from "../../repositories/word-memory-state.repository.js";

import { toLowerCase } from "zod";

export const answerFlashCardQuestionsService = async (
  userId,
  wordId,
  answer,
  expected_answer,
  answerTimeMs,
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User Doesn't Exists");
  }

  const word = await getMandarinWordById(wordId);

  if (!word) {
    throw new Error("Word Doesn't Exists");
  }

  const isCorrect =
    answer.trim().toLowerCase() === expected_answer.trim().toLowerCase();

  let attempt = await findFlashCardAttempt(userId, wordId);
  if (!attempt) {
    attempt = await createFlashCardAttempt(userId, wordId);
  }

  await createFlashCardAttemptLog(attempt.id, isCorrect, answerTimeMs);

  const totalReviews = attempt.totalReviews + 1;
  const correctReviews = attempt.correctReviews + (isCorrect ? 1 : 0);
  const averageAnswerTimeMs =
    ((attempt.averageAnswerTimeMs ?? 0) * attempt.totalReviews + answerTimeMs) /
    totalReviews;

  await updateFlashCardAttempt(attempt.id, {
    totalReviews,
    correctReviews,
    averageAnswerTimeMs,
    lastAnswerCorrect: isCorrect,
    lastReviewedAt: new Date(),
  });

  // =========================
  // MEMORY STATE
  // =========================

  let memoryState = await findWordMemoryState(userId, wordId);
  console.log(memoryState);

  if (!memoryState) {
    memoryState = await createWordMemoryState(userId, wordId);
    console.log(memoryState);
  }

  const now = new Date();

  let deltaDays = 0;

  if (memoryState?.lastReviewAt) {
    deltaDays = Math.max(
      1,
      Math.round(
        (now.getTime() - memoryState.lastReviewAt.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
  }

  const newRHistory = memoryState?.rHistory
    ? `${memoryState.rHistory},${isCorrect ? 1 : 0}`
    : `${isCorrect ? 1 : 0}`;

  const newTHistory = memoryState?.tHistory
    ? `${memoryState.tHistory},${deltaDays}`
    : "0";

  let currentPRecall = 0.86;

  if (
    memoryState?.predictedRecall !== null &&
    memoryState?.predictedRecall !== undefined
  ) {
    currentPRecall = memoryState.predictedRecall;
  }

  const newPHistory = memoryState?.pHistory
    ? `${memoryState.pHistory},${currentPRecall}`
    : `${currentPRecall}`;
    

    const predictedHalfLife = await predictHalfLife(
      newRHistory,
      newTHistory,
      newPHistory,
    );

    console.log(predictedHalfLife);

    const predictedRecall = Math.pow(2, -(1 / predictedHalfLife));
    console.log({
      r: newRHistory.split(",").length,
      t: newTHistory.split(",").length,
      p: newPHistory.split(",").length,
    });

    const nextReviewAt = new Date(now);

    nextReviewAt.setDate(
      nextReviewAt.getDate() + Math.max(1, Math.round(predictedHalfLife)),
    );

    await updateWordMemoryState(memoryState.id, {
      reviewCount: memoryState.reviewCount + 1,

      rHistory: newRHistory,
      tHistory: newTHistory,
      pHistory: newPHistory,

      predictedHalfLife,
      predictedRecall,

      lastReviewAt: now,
      lastAnswerTimeMs: answerTimeMs,
      averageAnswerTimeMs,
      difficulty,
    });

    console.log({
      isCorrect,
      correctMeaning: expected_answer,
    });

    return {
      isCorrect,
      correctMeaning: expected_answer,
    };
};;