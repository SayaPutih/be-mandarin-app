//import { GetMcMandarin } from "../../schema/mandarin-words/mandarin-words.schema";
import {
  getFlashCardQuestionsService,
  getFlashCardReviewQuestionsService,
  getFlashCardIntitateService,
} from "../../service/flash-card/flash-card-question.service.js";
import { getReviewQuestionService } from "../../service/flash-card/flash-card-review.service.js";

export const getFlashCardQuestionsController = async (req, res) => {
  try {
    const flashCardMcQuestionArray = [];
    for (let i = 0; i < 10; i++) {
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

export const getReviewWordsController = async (req, res) => {
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

export const getReviewQuestionController = async (req, res) => {
  try {
    const result = await getFlashCardReviewQuestionsService(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
      total: result.length,
      hasReview: result.length > 0,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


//vvv
export const getFlashCardInitiationController = async (req, res) => {

  try{

    const result = await getFlashCardIntitateService(req.user.id);
    return res.status(200).json({
      success: true,
      data: result,
      total: result.length,
      need: 20 - result.length ,
    });
  }catch(err){
    return res.status(500).json({
      message: err.message,
    });
  }

};