import {
  teacherRetentionAnalyticsService,
  teacherHardestVocabularyService,
  teacherHSKDistributionService,
} from "../../service/teacher/teacherAnalytics.service.js";

export const teacherRetentionAnalyticsController = async (req, res) => {
  try {
    const result = await teacherRetentionAnalyticsService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherHardestVocabularyController = async (req, res) => {
  try {
    const result = await teacherHardestVocabularyService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherHSKDistributionController = async (req, res) => {
  try {
    const result = await teacherHSKDistributionService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
