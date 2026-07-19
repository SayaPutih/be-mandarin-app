import {
  getCalendarService,
  getCalendarDetailService,
  getRecommendationService 
} from "../../../service/student/callender/studentCallender.service.js";

export const getCalendarController = async (req, res) => {
  try {
    const userId = req.user.id;

    const { start, end } = req.query;

    const result = await getCalendarService(userId, start, end);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCalendarDetailController = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await getCalendarDetailService(userId, req.params.date);

    return res.status(200).json({
      success: true,
      date: req.params.date,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecommendationController = async (req, res) => {
  try {
    const result = await getRecommendationService(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};