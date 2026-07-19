import { getReviewedWordsService } from "../../../service/student/vocabulary/studentVocabulary.service.js";

export const getReviewedWordsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getReviewedWordsService(userId, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to get reviewed words",
    });
  }
};
