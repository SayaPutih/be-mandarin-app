import express from "express";
import { validateTeacher } from "../../../middleware/validateTeacher.js";
import { validateToken } from "../../../middleware/validateToken.js";

import {
  teacherDashboardController,
  teacherVocabularyStatsController,
} from "../../../controller/teacher/dashboard/teacherDashboard.controller.js";

const router = express.Router();


router.get("/dashboard", validateToken, validateTeacher, teacherDashboardController);
router.get("/vocabulary/stats", validateToken, teacherVocabularyStatsController);

export default router