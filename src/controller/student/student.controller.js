import { getReviewedWordsService } from "../../service/student/student.service.js";


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

import {
  getCalendarService,
  getCalendarDetailService,
} from "../../service/student/studentSchedule.service.js";

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

import { getRecommendationService } from "../../service/student/studentRecom.service.js";

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