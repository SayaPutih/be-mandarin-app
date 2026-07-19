import {
  addStudentController,
  getAvailableStudentsController,
  removeStudentController,
  getStudentsByClassController,
  getWordsController,
} from "../../../../controller/teacher/student/class/teacherStudent.controller.js";
import express from "express";
import { validateTeacher } from "../../../../middleware/validateTeacher.js";
import { validateToken } from "../../../../middleware/validateToken.js";
const router = express.Router();

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

export default router;

