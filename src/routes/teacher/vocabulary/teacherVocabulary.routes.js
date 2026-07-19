import {
  teacherVocabularyController,
  teacherVocabularyDetailController,
  teacherCreateVocabularyController,
  teacherUpdateVocabularyController,
  teacherDeleteVocabularyController,
} from "../../../controller/teacher/vocabulary/teacherVocabulary.controller.js";

import express from "express"
import {validateTeacher} from "../../../middleware/validateTeacher.js"
import { validateToken } from "../../../middleware/validateToken.js";
const router = express.Router();
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

export default router;