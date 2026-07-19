import { findUserById } from "../../../repositories/user.repository.js";
import { predictHalfLife } from "../../../ml/predict-half-life.js";
import { getMandarinWordById } from "../../../repositories/mandarin-word.repository.js";

import {
  findFlashCardAttempt,
  createFlashCardAttempt,
  updateFlashCardAttempt,
} from "../../../repositories/flash-card-attempt.repository.js";

import { createFlashCardAttemptLog } from "../../../repositories/flash-card-attempt-log.repository.js";
import {
  calculateDeltaDays,
  appendHistory,
} from "../../../utils/memory-model.util.js";

import { getCurrentSystemDate } from "../../../repositories/system-config.repository.js";

import {
  findWordMemoryState,
  createWordMemoryState,
  updateWordMemoryState,
} from "../../../repositories/word-memory-state.repository.js";

function normalizeDifficulty(rawDifficulty) {
  const MIN = 0;
  const MAX = 0.0155;

  const normalized =
    ((rawDifficulty - MIN) / (MAX - MIN)) * 9 + 1;

  return Math.max(
    1,
    Math.min(10, normalized),
  );
}

export const answerFlashCardQuestionsService = async (
  userId,
  wordId,
  answer,
  expected_answer,
  answerTimeMs,
  now,
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
    attempt = await createFlashCardAttempt(userId, wordId, now);
  }

  await createFlashCardAttemptLog(attempt.id, isCorrect, answerTimeMs, now);

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
    lastReviewedAt: now,
    updatedAt: now,
  });

  // =========================
  // MEMORY STATE
  // =========================

    let memoryState = await findWordMemoryState(userId, wordId);
    console.log(memoryState);

    if (!memoryState) {
      memoryState = await createWordMemoryState(userId, wordId,now);
      console.log(memoryState);
    }

    console.log("Delta Days");
    console.log(memoryState.lastReviewAt);
    console.log(typeof memoryState.lastReviewAt);
    console.log(memoryState.lastReviewAt instanceof Date);

    const deltaDays = calculateDeltaDays(memoryState.lastReviewAt, now);

    const newRHistory = appendHistory(memoryState.rHistory, isCorrect ? 1 : 0);

    const newTHistory = appendHistory(memoryState.tHistory, deltaDays);

    // =========================
    // Recall sebelum review
    // =========================

    const previousHalfLife = memoryState.predictedHalfLife ?? 1;

    const recallBeforeReview = Math.pow(2, -(deltaDays / previousHalfLife));

    const newPHistory = appendHistory(memoryState.pHistory, recallBeforeReview);

    // =========================
    // Difficulty
    // =========================

    const rawDifficulty = word.lexicalDifficulty ?? 1;

    // kalau model GRU dilatih pakai lexicalDifficulty asli
    const wordDifficulty = rawDifficulty;

    // kalau model dilatih pakai skala 1-10
    // const wordDifficulty = normalizeDifficulty(rawDifficulty);

    // =========================
    // Predict Half Life
    // =========================

    const predictedHalfLife = await predictHalfLife(
      newRHistory,
      newTHistory,
      newPHistory,
      wordDifficulty,
    );

    // estimasi recall setelah update model
    const predictedRecall = Math.pow(2, -(deltaDays / predictedHalfLife));

    // =========================
    // Scheduling
    // =========================

    const targetRecall = 0.8;

    const nextReviewDays =
      (predictedHalfLife * Math.log(targetRecall)) / Math.log(0.5);

    const nextReviewAt = new Date(now);

    nextReviewAt.setDate(
      nextReviewAt.getDate() + Math.max(1, Math.round(nextReviewDays)),
    );

    console.log("---ANSWERING----");

    console.log({
      deltaDays,
      recallBeforeReview,
      predictedHalfLife,
      predictedRecall,
      nextReviewAt,
      difficulty: wordDifficulty,
    });

    await updateWordMemoryState(memoryState.id, {
      reviewCount: memoryState.reviewCount + 1,

      rHistory: newRHistory,
      tHistory: newTHistory,
      pHistory: newPHistory,

      wordDifficulty,

      //recallBeforeReview,

      predictedHalfLife,
      predictedRecall,

      nextReviewAt,

      lastReviewAt: now,
      lastAnswerTimeMs: answerTimeMs,
      averageAnswerTimeMs,
    });

    console.log({
      isCorrect,
      correctMeaning: expected_answer,
    });

    console.log("ANSWER:", answer);
    console.log("EXPECTED:", expected_answer);
    console.log("ISCORRECT:", isCorrect);

    return {
      isCorrect,
      correctMeaning: expected_answer,
    };
};