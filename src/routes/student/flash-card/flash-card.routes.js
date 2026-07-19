import {
  getFlashCardQuestionsController,
  getFlashCardSingleQuestionController,
  getReviewWordsController,
  getReviewQuestionController,
  getFlashCardInitiationController,
  getFlashCardAssignmentController,
} from "../../../controller/student/flash-card/flash-card-question.controller.js";
import { answerFlashCardController } from "../../../controller/student/flash-card/flash-card-answer.controller.js";

import express from "express"
import { validateToken } from "../../../middleware/validateToken.js";

const router = express.Router();

router.get("/questions", getFlashCardQuestionsController);
router.get("/single-question", getFlashCardSingleQuestionController);
router.get("/review", validateToken, getReviewWordsController);
router.get("/questions/review", validateToken, getReviewQuestionController);
router.post("/answer",validateToken,answerFlashCardController)
router.get("/initiate", validateToken, getFlashCardInitiationController);
router.post("/assignment", validateToken, getFlashCardAssignmentController);

export default router;