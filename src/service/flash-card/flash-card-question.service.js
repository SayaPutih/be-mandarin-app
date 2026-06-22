import {
  GetMcQuestion,
  GetMcOptions,
  GetReviewWords,
  GetMcQuestionById,
} from "../../repositories/flash-card/flash-card-question.repository.js";
import { shuffle } from "../../utils/shuffle.js";

export const getFlashCardQuestionsService = async () => {

    const flashCardHanzi = await GetMcQuestion();
    const options = await GetMcOptions(flashCardHanzi.id, 3);

    console.log(flashCardHanzi);
    console.log(options);

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

import { getCurrentSystemDate } from "../../repositories/system-config.repository.js";

export const getFlashCardReviewQuestionsService = async (userId)=>{
  const reviews = await GetReviewWords(userId); 
  const total = reviews.length;
  const id = reviews.map((a)=>a.wordId)

  const reviewBatch = []

  for(let i = 0 ; i<total ; i++){
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

  return reviewBatch

}

import { findUserFlashCardInteractionWords } from "../../repositories/flash-card-attempt.repository.js";
import { GetInitiation } from "../../repositories/flash-card/flash-card-question.repository.js";

export const getFlashCardIntitateService = async (
  userId
) => {
  const userInteractions =
    await findUserFlashCardInteractionWords(userId);

  const INITIAL_BATCH = 20;

  const howManyMore =
    INITIAL_BATCH - userInteractions.length;

  if (howManyMore <= 0) {
    return [];
  }

  const answeredWords = userInteractions.map(
    (a) => a.wordId
  );

  const flashCards = await GetInitiation(
    answeredWords,
    howManyMore
  );

  const initiateBatch = [];

  for (const flashCardHanzi of flashCards) {
    const options = await GetMcOptions(
      flashCardHanzi.id,
      3
    );

    const meanings =
      flashCardHanzi.meanings.map(
        (m) => m.meaning
      );

    const correctMeaning =
      meanings[
        Math.floor(
          Math.random() * meanings.length
        )
      ];

    const randomizedArray = shuffle([
      correctMeaning,
      ...options.map((x) => x.meaning),
    ]);

    initiateBatch.push({
      id: flashCardHanzi.id,

      hanzi:
        flashCardHanzi.simplified,

      pinyin:
        flashCardHanzi.pinyin,

      meanings,

      options: randomizedArray,

      hskLevel:
        flashCardHanzi.hskLevel,

      lexicalDifficulty:
        flashCardHanzi.lexicalDifficulty,

      expectedAnswer:
        correctMeaning,
    });
  }

  return initiateBatch;
};
