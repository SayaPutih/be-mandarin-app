import {
  getRetentionAnalytics,
  getHardestVocabulary,
  getHSKDistribution,
} from "../../repositories/teacher/teacherAnalytics.repository.js";

export const teacherRetentionAnalyticsService = async () => {
  return await getRetentionAnalytics();
};

export const teacherHardestVocabularyService = async () => {
  return await getHardestVocabulary();
};

export const teacherHSKDistributionService = async () => {
  return await getHSKDistribution();
};
