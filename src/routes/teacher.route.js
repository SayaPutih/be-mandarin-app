import express from "express"
import {validateTeacher} from "../middleware/validateTeacher.js"
import { validateToken } from "../middleware/validateToken.js";
import { getTeacherDashboard } from "../repositories/teacher/teacherDashboard.repository.js";
import {
  teacherClassCreateController,
  teacherClassGetAllController,
  getStudentsByClassController,
  addStudentController,
  getAssignmentsController,
  createAssignmentController,
  getAvailableStudentsController,
  removeStudentController,
  getWordsController,
  getAssignmentDetail,
  getAssignmentCardsController,
  getAssignmentStudentsController,
  removeAssignmentController,
} from "../controller/teacher/teacherClass.controller.js";

import {
  teacherVocabularyController,
  teacherVocabularyDetailController,
  teacherCreateVocabularyController,
  teacherUpdateVocabularyController,
  teacherDeleteVocabularyController,
} from "../controller/teacher/teacherWord.controller.js";

import {
  teacherGetStudentsController,
  teacherGetStudentDetailController,
  teacherGetStudentRetentionController,
  teacherGetStudentMasteredWordsController,
  teacherGetStudentForgottenWordsController,
  teacherGetStudentReviewScheduleController,
} from "../controller/teacher/teacherStudent.controller.js";

import {
  teacherRetentionAnalyticsController,
  teacherHardestVocabularyController,
  teacherHSKDistributionController,
} from "../controller/teacher/teacherAnalytics.controller.js";

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

router.get("/dashboard", validateToken, validateTeacher, getTeacherDashboard);


router.get(
  "/vocabulary",
  validateToken,
  validateTeacher,
  teacherVocabularyController,
);

router.get(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  teacherVocabularyDetailController,
);

router.post(
  "/vocabulary",
  validateToken,
  validateTeacher,
  teacherCreateVocabularyController,
);

router.put(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  teacherUpdateVocabularyController,
);

router.delete(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  teacherDeleteVocabularyController,
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

router.get(
  "/analytics/retention",
  validateToken,
  validateTeacher,
  teacherRetentionAnalyticsController,
);

router.get(
  "/analytics/hardest-vocabulary",
  validateToken,
  validateTeacher,
  teacherHardestVocabularyController,
);

router.get(
  "/analytics/hsk-distribution",
  validateToken,
  validateTeacher,
  teacherHSKDistributionController,
);

router.post(
  "/class/create",
  validateToken,
  validateTeacher,
  teacherClassCreateController,
);

router.get(
  "/class/get",
  validateToken,
  validateTeacher,
  teacherClassGetAllController,
);

router.get(
  "/classes/:classId/students",
  validateToken,
  validateTeacher,
  getStudentsByClassController,
);

router.post(
  "/classes/:classId/students",
  validateToken,
  validateTeacher,
  addStudentController,
);

router.get(
  "/classes/:classId/assignments",
  validateToken,
  validateTeacher,
  getAssignmentsController,
);

router.post(
  "/classes/:classId/assignments",
  validateToken,
  validateTeacher,
  createAssignmentController,
);

router.get(
  "/classes/:classId/available-students",
  validateToken,
  validateTeacher,
  getAvailableStudentsController,
);

router.delete(
  "/classes/:classId/students",
  validateToken,
  validateTeacher,
  removeStudentController,
);

router.get("/words", validateToken, validateTeacher, getWordsController);

router.get(
  "/assignments/:assignmentId",
  validateToken,
  validateTeacher,
  getAssignmentDetail,
);

router.get(
  "/assignments/:assignmentId/cards",
  validateToken,
  validateTeacher,
  getAssignmentCardsController,
);

router.get(
  "/assignments/:assignmentId/students",
  validateToken,
  validateTeacher,
  getAssignmentStudentsController,
);

router.delete(
  "/assignment/remove",
  validateToken,
  validateTeacher,
  removeAssignmentController,
);

export default router;