import { GetNotificationController } from "../controller/notification/notification.controller.js";
import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import { validateTeacher } from "../middleware/validateTeacher.js";
import { validateAdmin } from "../middleware/validateAdmin.js";

const router = express.Router();

router.get("/get-all", validateToken,GetNotificationController);

export default router;
