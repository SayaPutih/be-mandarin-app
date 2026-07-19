import express from "express";
import { validateTeacher } from "../../../middleware/validateTeacher.js";
import { validateToken } from "../../../middleware/validateToken.js";
const router = express.Router();
import {
  teacherRetentionAnalyticsController,
  teacherHardestVocabularyController,
  teacherHSKDistributionController,
} from "../../../controller/teacher/analytics/teacherAnalytics.controller.js";

router.get(
  "/analytics/retention",
  validateToken,
  validateTeacher,
  teacherRetentionAnalyticsController,
);

router.get(
  "/analytics/hardest-vocabulary",
  validateToken,
  validateTeacher,
  teacherHardestVocabularyController,
);

router.get(
  "/analytics/hsk-distribution",
  validateToken,
  validateTeacher,
  teacherHSKDistributionController,
);

export default router;