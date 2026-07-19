import express from "express";
import { validateTeacher } from "../../../middleware/validateTeacher.js";
import { validateToken } from "../../../middleware/validateToken.js";

import {
  teacherClassCreateController,
  teacherClassGetAllController,
  teacherDeleteClassController,
} from "../../../controller/teacher/class/teacherClass.controller.js";
const router = express.Router();
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

router.delete(
  "/class/:id",
  validateToken,
  validateTeacher,
  teacherDeleteClassController,
);

export default router;