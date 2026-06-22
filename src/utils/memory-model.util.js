import { getCurrentSystemDate } from "../repositories/system-config.repository.js";

export const calculateDeltaDays = (lastReviewAt, now) => {
  if (!lastReviewAt) {
    return 0;
  }

  return Math.max(
    1,
    Math.round(
      (now.getTime() - lastReviewAt.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
};

export const appendHistory = (history, value) => {
  return history ? `${history},${value}` : `${value}`;
};
