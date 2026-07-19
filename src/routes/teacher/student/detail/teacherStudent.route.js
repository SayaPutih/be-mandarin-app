import express from "express"
import {validateTeacher} from "../../../../middleware/validateTeacher.js"
import { validateToken } from "../../../../middleware/validateToken.js";

import {
  teacherGetStudentsController,
  teacherGetStudentDetailController,
  teacherGetStudentRetentionController,
  teacherGetStudentMasteredWordsController,
  teacherGetStudentForgottenWordsController,
  teacherGetStudentReviewScheduleController,
} from "../../../../controller/teacher/student/detail/teacherStudent.controller.js";

const router = express.Router();

router.get(
  "/confirm-teacher",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      return res.status(200).json("You are Either a teacher or an admin");
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },
);

router.get(
  "/students",
  validateToken,
  validateTeacher,
  teacherGetStudentsController,
);

router.get(
  "/students/:id",
  validateToken,
  validateTeacher,
  teacherGetStudentDetailController,
);

router.get(
  "/students/:id/retention",
  validateToken,
  validateTeacher,
  teacherGetStudentRetentionController,
);

router.get(
  "/students/:id/mastered-words",
  validateToken,
  validateTeacher,
  teacherGetStudentMasteredWordsController,
);

router.get(
  "/students/:id/forgotten-words",
  validateToken,
  validateTeacher,
  teacherGetStudentForgottenWordsController,
);

router.get(
  "/students/:id/review-schedule",
  validateToken,
  validateTeacher,
  teacherGetStudentReviewScheduleController,
);

export default router;