import {
  getMandarinSenteneQuestionController,
} from "../controller/mandarin-sentence/mandarin-sentence-question.controller.js";
import {
  mandarinSentenceAnswerController,
} from "../controller/mandarin-sentence/mandarin-sentence-answer.controller.js";
import express from "express";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/question",getMandarinSenteneQuestionController);
router.post("/answer",validateToken, mandarinSentenceAnswerController);

export default router;