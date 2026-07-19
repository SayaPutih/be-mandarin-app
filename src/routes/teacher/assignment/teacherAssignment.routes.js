import {
  createAssignmentController,
  getAssignmentsController,
  getAssignmentDetailController,
  updateAssignmentController,
  removeAssignmentController,
  getUpdateAssignmentController,
  getAssignmentCardsController,
  getAssignmentStudentsController,
} from "../../../controller/teacher/assignment/teacherAssignment.controller.js";
import express from "express";
import { validateTeacher } from "../../../middleware/validateTeacher.js";
import { validateToken } from "../../../middleware/validateToken.js";

const router = express.Router();
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
  "/assignments/:assignmentId/update",
  validateToken,
  validateTeacher,
  getUpdateAssignmentController,
);

router.put(
  "/assignments/:assignmentId/update",
  validateToken,
  validateTeacher,
  updateAssignmentController,
);

router.get(
  "/assignments/:assignmentId",
  validateToken,
  validateTeacher,
  getAssignmentDetailController,
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