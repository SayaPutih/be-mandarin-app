import express from "express";
import prisma from "../config/prisma.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();


router.get("/calendar", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { start, end } = req.query;

    const reviews = await prisma.WordMemoryState.findMany({
      where: {
        userId,
        nextReviewAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      select: {
        nextReviewAt: true,
      },
    });

    const grouped = {};

    reviews.forEach((item) => {
      const date = item.nextReviewAt.toISOString().split("T")[0];

      grouped[date] = (grouped[date] || 0) + 1;
    });

    return res.json({
      success: true,
      data: grouped,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/calendar/:date", validateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const dateStr = req.params.date;

    const start = new Date(`${dateStr}T00:00:00`);

    const end = new Date(`${dateStr}T23:59:59`);

    const reviews = await prisma.WordMemoryState.findMany({
      where: {
        userId,
        nextReviewAt: {
          gte: start,
          lte: end,
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
        nextReviewAt: "asc",
      },
    });

    const result = reviews.map((item) => ({
      id: item.id,
      wordId: item.word.id,
      simplified: item.word.simplified,
      pinyin: item.word.pinyin_tone,
      hskLevel: item.word.hskLevel,
      meanings: item.word.meanings,
      nextReviewAt: item.nextReviewAt,
      predictedHalfLife: item.predictedHalfLife,
    }));

    return res.json({
      success: true,
      date: dateStr,
      count: result.length,
      data: result,
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