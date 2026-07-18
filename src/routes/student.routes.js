import {
  getReviewedWordsController,
  getCalendarController,
  getCalendarDetailController,
  getRecommendationController,
} from "../controller/student/student.controller.js";
import {
  getAllClassController,
  GetAssignmentsByClassController,
  GetAssignmentCardsController,
} from "../controller/student/studentClass.controller.js";
import express from "express";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get(
  "/reviewed-words",
  validateToken,
  getReviewedWordsController,
);

router.get("/calendar", validateToken, getCalendarController);

router.get("/calendar/:date", validateToken, getCalendarDetailController);

router.get("/recom", validateToken, getRecommendationController);

router.get("/classes",validateToken,getAllClassController);


router.get(
  "/classes/:classId/assignments",
  validateToken,
  GetAssignmentsByClassController,
);

router.get(
  "/assignments/:assignmentId/cards",
  validateToken,
  GetAssignmentCardsController,
);


export default router;
