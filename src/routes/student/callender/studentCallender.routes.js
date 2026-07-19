import express from "express";
import { validateToken } from "../../../middleware/validateToken.js";
import {
  getCalendarController,
  getCalendarDetailController,
  getRecommendationController,
} from "../../../controller/student/callender/studentCallender.controller.js";
const router = express.Router();

router.get("/calendar", validateToken, getCalendarController);
router.get("/calendar/:date", validateToken, getCalendarDetailController);
router.get("/recom", validateToken, getRecommendationController);

export default router;