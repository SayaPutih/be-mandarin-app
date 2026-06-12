//import { GetMcMandarin } from "../../schema/mandarin-words/mandarin-words.schema";
import { getFlashCardQuestionsService } from "../../service/flash-card/flash-card-question.service.js";
import { getReviewQuestionService } from "../../service/flash-card/flash-card-review.service.js";

export const getFlashCardQuestionsController = async (req, res) => {
  try {
    const flashCardMcQuestionArray = [];
    for (let i = 0; i < 5; i++) {
      let flashCardMcQuestion = await getFlashCardQuestionsService();
      flashCardMcQuestionArray.push(flashCardMcQuestion);
    }

    return res.status(200).json({
      success: true,
      data: flashCardMcQuestionArray,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFlashCardSingleQuestionController = async (req, res) => {
  try {
    let flashCardMcQuestion = await getFlashCardQuestionsService();

    return res.status(200).json({
      success: true,
      data: flashCardMcQuestion,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getReviewQuestionController = async (req, res) => {
  try {
    const result = await getReviewQuestionService(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
      hasReview: result.totalDue > 1,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};