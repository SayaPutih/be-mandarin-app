import {
  getFlashCardQuestionsService,
  getFlashCardReviewQuestionsService,
  getFlashCardIntitateService,
  getFlashCardAssignmentQuestionsService,
  getReviewQuestionService
} from "../../../service/student/flash-card/flash-card-question.service.js";

export const getFlashCardAssignmentController = async (req, res) => {
  try {
    console.log("FlashCard ASsignment Controller")
    console.log(req.body);
    const { wordIds } = req.body;

    const flashcards = await getFlashCardAssignmentQuestionsService(wordIds);

    return res.status(200).json({
      success: true,
      data: flashcards,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getFlashCardQuestionsController = async (req, res) => {
  try {
    const hskLevel = Number(req.query.hskLevel);


    const flashCardMcQuestionArray = [];
    for (let i = 0; i < 10; i++) {
      let flashCardMcQuestion = await getFlashCardQuestionsService(hskLevel);
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