import express from "express";
import { validateToken } from "../../../middleware/validateToken.js";
import {
  getAllClassController,
  GetAssignmentsByClassController,
  GetAssignmentCardsController,
} from "../../../controller/student/class/studentClass.controller.js";
const router = express.Router();

//class
router.get("/classes",validateToken,getAllClassController);
router.get(
  "/classes/:classId/assignments",
  validateToken,
  GetAssignmentsByClassController,
);
router.get(
  "/assignments/:assignmentId/cards",
  validateToken,
  GetAssignmentCardsController,
);


export default router;