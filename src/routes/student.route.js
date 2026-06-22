import { validateAdmin } from "../middleware/validateAdmin.js";
import { validateTeacher } from "../middleware/validateTeacher.js";
import { validateToken } from "../middleware/validateToken.js";
import express from "express"
import prisma from "../config/prisma.js";

const router = express.Router()

router.get("/students/reviewed-words", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await prisma.flashCardAttempt.count({
      where: {
        userId,
      },
    });

    const data = await prisma.flashCardAttempt.findMany({
      where: {
        userId,
      },
      include: {
        word: {
          include: {
            meanings: true,
          },
        },
      },
      orderBy: {
        totalReviews: "desc",
      },
      skip,
      take: limit,
    });

    return res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to get reviewed words",
    });
  }
});
export default router;
