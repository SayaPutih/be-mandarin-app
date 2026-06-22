import { answerFlashCardQuestionsService } from "../../../service/flash-card/flash-card-answer.service.js";

import { validateToken } from "../middleware/validateToken.js";
import express from "express";
const router = express.Router();

router.get("/new-answer",validateToken, (req,res)=>{
  try {
    const body = req.body;
    const userId = req.user.id;

    // BULK
    if (Array.isArray(body.answers)) {
      const results = [];

      for (const item of body.answers) {
        const result = await answerFlashCardQuestionsService(
          userId,
          item.wordId,
          item.answer,
          item.expected_answer,
          item.answerTimeMs,
        );

        results.push(result);
      }

      return res.status(200).json({
        success: true,
        data: results,
      });
    }

    // SINGLE
    const result = await answerFlashCardQuestionsService(
      userId,
      body.wordId,
      body.answer,
      body.expected_answer,
      body.answerTimeMs,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
})

export default router;