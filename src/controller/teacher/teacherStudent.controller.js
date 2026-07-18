import {
  teacherGetStudentsService,
  teacherGetStudentDetailService,
  teacherGetStudentRetentionService,
  teacherGetStudentMasteredWordsService,
  teacherGetStudentForgottenWordsService,
  teacherGetStudentReviewScheduleService,
} from "../../service/teacher/teacherStudent.service.js";

export const teacherGetStudentsController = async (req, res) => {
  try {
    const result = await teacherGetStudentsService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherGetStudentDetailController = async (req, res) => {
  try {
    const result = await teacherGetStudentDetailService(req.params.id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
export const teacherGetStudentRetentionController = async (req, res) => {
  try {
    const result = await teacherGetStudentRetentionService(req.params.id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherGetStudentMasteredWordsController = async (req, res) => {
  try {
    const result = await teacherGetStudentMasteredWordsService(req.params.id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherGetStudentForgottenWordsController = async (req, res) => {
  try {
    const result = await teacherGetStudentForgottenWordsService(req.params.id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherGetStudentReviewScheduleController = async (req, res) => {
  try {
    const result = await teacherGetStudentReviewScheduleService(req.params.id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

