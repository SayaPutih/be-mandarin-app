import {
  GetMcQuestion,
  GetMcOptions,
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
      expected_answer : correctMeaning,
    };
};
