import {
  findAllUserController,
  findUserByIdController,
  createTeacherController,
  updateUserController,
  deleteUserController,
} from "../controller/admin/admin.controller.js";

import { validateToken } from "../middleware/validateToken.js";
import { validateAdmin } from "../middleware/validateAdmin.js";

import express from "express";

const router = express.Router();

router.get("/get-all", validateToken, validateAdmin, findAllUserController);
router.get("/get-user-by-id/:id",validateToken,validateAdmin,findUserByIdController);
router.post("/create-teacher",validateToken,validateAdmin,createTeacherController);
router.put(
  "/update-user/:id",
  validateToken,
  validateAdmin,
  updateUserController,
);
router.delete(
  "/delete-user/:id",
  validateToken,
  validateAdmin,
  deleteUserController,
);

export default router;

//mape
//0.8  0.75
//0.0221 

//0.3144
//0.144