import { getStatisticData } from "../../../repositories/statistics/statistics.repository.js";

export const getStatisticService = async (userId) => {
  const data = await getStatisticData(userId);

  const averageRecall =
    data.memoryStates.length > 0
      ? data.memoryStates.reduce(
          (sum, item) => sum + (item.predictedRecall ?? 0),
          0,
        ) / data.memoryStates.length
      : 0;

  const averageHalfLife =
    data.memoryStates.length > 0
      ? data.memoryStates.reduce(
          (sum, item) => sum + (item.predictedHalfLife ?? 0),
          0,
        ) / data.memoryStates.length
      : 0;

  const totalCorrect = data.attempts.reduce(
    (sum, item) => sum + item.correctReviews,
    0,
  );

  const totalAttempt = data.attempts.reduce(
    (sum, item) => sum + item.totalReviews,
    0,
  );

  const averageAccuracy =
    totalAttempt > 0 ? (totalCorrect / totalAttempt) * 100 : 0;

  return {
    totalLearnedWords: data.totalLearnedWords,
    totalReviews: data.totalReviews,
    dueReviews: data.dueReviews,

    averageRecall: Number(averageRecall.toFixed(2)),
    averageHalfLife: Number(averageHalfLife.toFixed(2)),
    averageAccuracy: Number(averageAccuracy.toFixed(2)),
  };
};
