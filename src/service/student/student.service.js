import { getReviewedWords } from "../../repositories/student/student.repository.js";

export const getReviewedWordsService = async (userId, page, limit) => {
  return await getReviewedWords(userId, page, limit);
};
