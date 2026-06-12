import { getSentenceById } from "../../repositories/mandarin-sentence/mandarin-sentece-question.repository.js";
import { evaluateEnglishTranslation } from "./llm-evaluator.service.js";
import { createSentenceAttempt } from "../../repositories/mandarin-sentence/mandarin-sentence-answer.repository.js";

export const mandarinSentenceAnswerService = async ({
    userId,
    questionId,
    englishSentence,
})=>{
    
    if(englishSentence == "")throw new Error("Blank Sentence")

    const question = await getSentenceById(questionId);

    const llm = await evaluateEnglishTranslation({
      mandarinText: question.mandarinText,
      expectedAnswer: question.englishTranslation,
      userAnswer: englishSentence,
    });

    const result = await createSentenceAttempt({
      sentenceId: questionId,
      userId: userId,
      scoring: llm.score,
      isCorrect: llm.isCorrect,
      userAnswer: englishSentence,
      aiFeedback: llm.feedback,
    });

    return result;
}