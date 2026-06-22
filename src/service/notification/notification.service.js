//Ada Due Review Get Review NOW
import { GetReviewWords } from "../../repositories/flash-card/flash-card-question.repository.js";

//Belom ada Interactions
import { findUserFlashCardInteraction } from "../../repositories/flash-card-attempt.repository.js";

export const GetReviewNotificationService = async (id) => {
  const hasReview = await GetReviewWords(id);

  return {
    total: hasReview.length,
  };
};

export const GetNewUserNotificationService = async (id) => {
  const hasReview = await findUserFlashCardInteraction(id);

  return {
    total: hasReview,
  };
};