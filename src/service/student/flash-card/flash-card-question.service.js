import {
  GetMcQuestion,
  GetMcOptions,
  GetReviewWords,
  GetMcQuestionById,
  GetMcOptionsByWordIds,
  GetWordsByIds,
} from "../../../repositories/flash-card/flash-card-question.repository.js";
import { getCurrentSystemDate } from "../../../repositories/system-config.repository.js";
import { shuffle } from "../../../utils/shuffle.js";
import { findUserFlashCardInteractionWords } from "../../../repositories/flash-card-attempt.repository.js";
import { GetInitiation } from "../../../repositories/flash-card/flash-card-question.repository.js";

export const getFlashCardAssignmentQuestionsService = async (wordIds) => {
  const words = await GetWordsByIds(wordIds);

  const flashcards = [];

  for (const word of words) {
    const meanings = word.meanings.map((m) => m.meaning);

    const correctMeaning =
      meanings[Math.floor(Math.random() * meanings.length)];

    const options = await GetMcOptionsByWordIds(word.id, 3);

    flashcards.push({
      id: word.id,

      hanzi: word.simplified,

      pinyin: word.pinyin,

      meaning: meanings,

      options: shuffle([correctMeaning, ...options.map((o) => o.meaning)]),

      hsk_level: word.hskLevel,

      difficulty: word.lexicalDifficulty,

      expected_answer: correctMeaning,
    });
  }

  return flashcards;
};

export const getFlashCardQuestionsService = async (hskLevel) => {
  const flashCardHanzi = await GetMcQuestion(hskLevel);

  console.log("HSK:", hskLevel);

  console.log("QUESTION:", flashCardHanzi);

  if (!flashCardHanzi) {
    throw new Error(`No flashcard found for HSK ${hskLevel}`);
  }

  const options = await GetMcOptions(flashCardHanzi.id, 3);

  console.log(flashCardHanzi);
  console.log(options);

  const meanings = flashCardHanzi.meanings
    .split("=|=")
    .map((x) => x.trim())
    .filter(Boolean);

  const correctMeaning = meanings[Math.floor(Math.random() * meanings.length)];

  const randomizedArray = shuffle([
    correctMeaning,
    ...options.map((x) => x.meaning),
  ]);

  console.log(flashCardHanzi.hskLevel);

  return {
    id: flashCardHanzi.id,
    hanzi: flashCardHanzi.simplified,
    pinyin: flashCardHanzi.pinyin,
    meaning: meanings,
    options: randomizedArray,
    hsk_level: flashCardHanzi.hskLevel,
    difficulty: flashCardHanzi.lexicalDifficulty,
    expected_answer: correctMeaning,
  };
};

export const getFlashCardReviewQuestionsService = async (userId) => {
  const reviews = await GetReviewWords(userId);
  const total = reviews.length;
  const id = reviews.map((a) => a.wordId);

  const reviewBatch = [];

  for (let i = 0; i < total; i++) {
    const flashCardHanzi = await GetMcQuestionById(id[i]);
    const options = await GetMcOptions(id[i], 3);

    const meanings = flashCardHanzi.meanings
      .split("=|=")
      .map((x) => x.trim())
      .filter(Boolean);

    const correctMeaning =
      meanings[Math.floor(Math.random() * meanings.length)];

    const randomizedArray = shuffle([
      correctMeaning,
      ...options.map((x) => x.meaning),
    ]);

    reviewBatch.push({
      id: flashCardHanzi.id,
      hanzi: flashCardHanzi.simplified,
      pinyin: flashCardHanzi.pinyin,
      meaning: meanings,
      options: randomizedArray,
      hsk_level: flashCardHanzi.hskLevel,
      difficulty: flashCardHanzi.lexicalDifficulty,
      expected_answer: correctMeaning,
    });
  }

  return reviewBatch;
};

export const getFlashCardIntitateService = async (userId) => {
  const userInteractions = await findUserFlashCardInteractionWords(userId);

  const INITIAL_BATCH = 20;

  const howManyMore = INITIAL_BATCH - userInteractions.length;

  if (howManyMore <= 0) {
    return [];
  }

  const answeredWords = userInteractions.map((a) => a.wordId);

  const flashCards = await GetInitiation(answeredWords, howManyMore);

  const initiateBatch = [];

  for (const flashCardHanzi of flashCards) {
    const options = await GetMcOptions(flashCardHanzi.id, 3);

    const meanings = flashCardHanzi.meanings.map((m) => m.meaning);

    const correctMeaning =
      meanings[Math.floor(Math.random() * meanings.length)];

    const randomizedArray = shuffle([
      correctMeaning,
      ...options.map((x) => x.meaning),
    ]);

    initiateBatch.push({
      id: flashCardHanzi.id,

      hanzi: flashCardHanzi.simplified,

      pinyin: flashCardHanzi.pinyin,

      meanings,

      options: randomizedArray,

      hskLevel: flashCardHanzi.hskLevel,

      lexicalDifficulty: flashCardHanzi.lexicalDifficulty,

      expectedAnswer: correctMeaning,
    });
  }

  return initiateBatch;
};

export const getReviewQuestionService = async (userId) => {
  const reviews = await GetReviewWords(userId);

  const currentDate = await getCurrentSystemDate();

  return {
    totalDue: reviews.length,

    words: reviews.map((r) => ({
      id: r.word.id,

      hanzi: r.word.simplified,

      pinyin: r.word.pinyin,

      meanings: r.word.meanings.map((m) => m.meaning),

      reviewCount: r.reviewCount,

      predictedRecall: r.predictedRecall,

      nextReviewAt: r.nextReviewAt,

      overdueDays: r.nextReviewAt
        ? Math.max(
            0,
            Math.floor(
              (currentDate.getTime() - r.nextReviewAt.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0,
    })),
  };
};