import { getStatisticController } from "../../../controller/student/statistics/statistics.controller.js";
import express from "express";
import { validateToken } from "../../../middleware/validateToken.js";


const router = express.Router()

router.get("/stats", validateToken, getStatisticController);

export default router;