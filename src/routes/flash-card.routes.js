import {
  getFlashCardQuestionsController,
  getFlashCardSingleQuestionController,
  getReviewWordsController,
  getReviewQuestionController,
  getFlashCardInitiationController,
} from "../controller/flash-card/flash-card-question.controller.js";
import { answerFlashCardController } from "../controller/flash-card/flash-card-answer.controller.js";

import express from "express"
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/questions", getFlashCardQuestionsController);
router.get("/single-question", getFlashCardSingleQuestionController);
router.get("/review", validateToken, getReviewWordsController);
router.get("/questions/review", validateToken, getReviewQuestionController);
router.post("/answer",validateToken,answerFlashCardController)
router.get("/initiate", validateToken, getFlashCardInitiationController);

export default router;