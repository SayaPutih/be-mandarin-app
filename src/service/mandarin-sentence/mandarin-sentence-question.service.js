import { getSentence } from "../../repositories/mandarin-sentence/mandarin-sentece-question.repository.js";

export const getMandarinSenteneQuestionService = async ()=>{
    const result = await getSentence(5);
    return result;
}