import express from "express";

import {
  GetAnalyticsOverview,
  GetAnalyticsDifficulty,
  GetAnalyticsRecent,
  GetAnalyticsWordProgress,
} from "../controller/analytic/analytic.controller.js";

import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/overview", validateToken , GetAnalyticsOverview);

router.get("/difficulty", validateToken , GetAnalyticsDifficulty);

router.get("/recent", validateToken , GetAnalyticsRecent);

router.get("/word-progress", validateToken , GetAnalyticsWordProgress);

//router.get("/user-half-life",validateToken,)

export default router;
