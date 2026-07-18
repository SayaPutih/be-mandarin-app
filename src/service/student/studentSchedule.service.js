import {
  getCalendar,
  getCalendarDetail,
} from "../../repositories/student/studentSchedule.repository.js";

export const getCalendarService = async (userId, start, end) => {
  const reviews = await getCalendar(userId, start, end);

  const grouped = {};

  reviews.forEach((item) => {
    const date = item.nextReviewAt.toISOString().split("T")[0];

    grouped[date] = (grouped[date] || 0) + 1;
  });

  return grouped;
};

export const getCalendarDetailService = async (userId, dateStr) => {
  const reviews = await getCalendarDetail(userId, dateStr);

  return reviews.map((item) => ({
    id: item.id,
    wordId: item.word.id,
    simplified: item.word.simplified,
    pinyin: item.word.pinyin_tone,
    hskLevel: item.word.hskLevel,
    meanings: item.word.meanings,
    nextReviewAt: item.nextReviewAt,
    predictedHalfLife: item.predictedHalfLife,
  }));
};
