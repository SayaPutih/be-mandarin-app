import express from "express";
import prisma from "../config/prisma.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();


router.get("/recom", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();

    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);

    const dueReview = await prisma.WordMemoryState.findMany({
      where: {
        userId,
        nextReviewAt: {
          gte: now,
          lte: next7Days,
        },
      },
      include: {
        word: {
          include: {
            meanings: true,
            attempts: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    const dueReviewMapped = dueReview.map((item) => {
      const diffDays = Math.ceil(
        (new Date(item.nextReviewAt).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        ...item,

        dueInDays: diffDays,

        correctReviews: item.word.attempts?.[0]?.correctReviews ?? 0,

        totalReviews: item.word.attempts?.[0]?.totalReviews ?? 0,
      };
    });

    const lowHalfLife = await prisma.WordMemoryState.findMany({
      where: {
        userId,
        predictedHalfLife: {
          not: null,
        },
      },
      include: {
        word: {
          include: {
            meanings: true,
          },
        },
      },
      orderBy: {
        predictedHalfLife: "asc",
      },
      take: 10,
    });

    const debug = await prisma.WordMemoryState.findMany({
      where: {
        userId,
      },
      select: {
        nextReviewAt: true,
        predictedHalfLife: true,
      },
    });

    console.log("DEBUG------------------------------------------")
    console.log(debug);

    return res.json({
      success: true,
      data: {
        dueReview: dueReviewMapped,
        lowHalfLife,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;