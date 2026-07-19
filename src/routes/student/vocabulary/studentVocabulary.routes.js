import express from "express";
import { validateToken } from "../../../middleware/validateToken.js";
import {
  getReviewedWordsController
} from "../../../controller/student/vocabulary/studentVocabulary.controller.js";
const router = express.Router();

router.get("/reviewed-words", validateToken, getReviewedWordsController);

export default router;