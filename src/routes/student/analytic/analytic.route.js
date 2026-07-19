import express from "express";

import {
  GetAnalyticsOverviewController,
  GetAnalyticsDifficultyController,
  GetAnalyticsRecentController,
  GetAnalyticsWordProgressController,
} from "../../../controller/student/analytic/analytic.controller.js";

import { validateToken } from "../../../middleware/validateToken.js";

const router = express.Router();

router.get("/overview", validateToken, GetAnalyticsOverviewController);
router.get("/difficulty", validateToken, GetAnalyticsDifficultyController);
router.get("/recent", validateToken, GetAnalyticsRecentController);
router.get("/word-progress", validateToken, GetAnalyticsWordProgressController);

export default router;
