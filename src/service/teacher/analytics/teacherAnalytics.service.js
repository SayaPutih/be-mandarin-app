import {
  getRetentionAnalyticsRepository,
  getHardestVocabularyRepository,
  getHSKDistributionRepository,
} from "../../../repositories/teacher/analytics/teacherAnalytics.repository.js";

export const teacherRetentionAnalyticsService = async () => {
  return await getRetentionAnalyticsRepository();
};

export const teacherHardestVocabularyService = async () => {
  return await getHardestVocabularyRepository();
};

export const teacherHSKDistributionService = async () => {
  return await getHSKDistributionRepository();
};
