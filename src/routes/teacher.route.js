import { validateAdmin } from "../middleware/validateAdmin.js";
import { validateTeacher } from "../middleware/validateTeacher.js";
import { validateToken } from "../middleware/validateToken.js";
import express from "express"
import prisma from "../config/prisma.js";

const router = express.Router()

router.get(
  "/confirm-teacher",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      return res.status(200).json("You are Either a teacher or an admin");
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },
);

// DASHBOARD OVERVIEW
router.get(
  "/dashboard",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const totalStudents = await prisma.user.count({
        where: { role: "USER" },
      });

      const totalVocabulary = await prisma.mandarinWord.count();

      const totalReviewsToday = await prisma.flashCardAttempt.aggregate({
        _sum: {
          totalReviews: true,
        },
      });

      const avgRetention = await prisma.wordMemoryState.aggregate({
        _avg: {
          predictedRecall: true,
        },
      });

      return res.status(200).json({
        totalStudents,
        totalVocabulary,
        totalReviewsToday:
          totalReviewsToday._sum.totalReviews || 0,
        averageRetention:
          avgRetention._avg.predictedRecall || 0,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// VOCABULARY MANAGEMENT
// =========================

router.get("/vocabulary", validateToken, validateTeacher, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [words, total] = await Promise.all([
      prisma.mandarinWord.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          meanings: true,
        },
      }),

      prisma.mandarinWord.count(),
    ]);

    return res.status(200).json({
      data: words,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const word = await prisma.mandarinWord.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          meanings: true,
        },
      });

      return res.status(200).json(word);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post("/vocabulary", validateToken, validateTeacher, async (req, res) => {
  try {
    const {
      simplified,
      pinyin,
      hskLevel,
      pos,
      radical,
      lexicalDifficulty,
      meanings,
    } = req.body;

    const existing = await prisma.mandarinWord.findUnique({
      where: {
        simplified,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Vocabulary already exists",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const word = await tx.mandarinWord.create({
        data: {
          simplified,
          pinyin,
          hskLevel,
          pos,
          radical,
          lexicalDifficulty,
        },
      });

      if (meanings && Array.isArray(meanings)) {
        await tx.mandarinMeaning.createMany({
          data: meanings.map((meaning) => ({
            wordId: word.id,
            meaning,
          })),
        });
      }

      return word;
    });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});


router.put(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const id = req.params.id;

      const {
        simplified,
        pinyin,
        hskLevel,
        pos,
        radical,
        lexicalDifficulty,
        meanings,
      } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.mandarinWord.update({
          where: { id },
          data: {
            simplified,
            pinyin,
            hskLevel,
            pos,
            radical,
            lexicalDifficulty,
          },
        });

        await tx.mandarinMeaning.deleteMany({
          where: {
            wordId: id,
          },
        });

        if (meanings && Array.isArray(meanings)) {
          await tx.mandarinMeaning.createMany({
            data: meanings.map((meaning) => ({
              wordId: id,
              meaning,
            })),
          });
        }

        return updated;
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.delete(
  "/vocabulary/:id",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      await prisma.mandarinWord.delete({
        where: {
          id: req.params.id,
        },
      });

      return res.status(200).json({
        message: "Vocabulary deleted",
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// STUDENTS
// =========================

router.get(
  "/students",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "USER",
        },
        include: {
          memoryStates: true,
        },
      });

      return res.status(200).json(students);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.get(
  "/students/:id",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const student = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          attempts: true,
          memoryStates: true,
        },
      });

      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// RETENTION ANALYTICS
// =========================

router.get(
  "/students/:id/retention",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const retention =
        await prisma.wordMemoryState.aggregate({
          where: {
            userId: req.params.id,
          },
          _avg: {
            predictedRecall: true,
            predictedHalfLife: true,
          },
        });

      return res.status(200).json(retention);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// MASTERED WORDS
// =========================

router.get(
  "/students/:id/mastered-words",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const words = await prisma.wordMemoryState.findMany({
        where: {
          userId: req.params.id,
          predictedRecall: {
            gte: 0.8,
          },
        },
        include: {
          word: true,
        },
      });

      return res.status(200).json(words);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// FORGOTTEN WORDS
// =========================

router.get(
  "/students/:id/forgotten-words",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const words = await prisma.wordMemoryState.findMany({
        where: {
          userId: req.params.id,
          predictedRecall: {
            lt: 0.5,
          },
        },
        include: {
          word: true,
        },
      });

      return res.status(200).json(words);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// REVIEW SCHEDULE
// =========================

router.get(
  "/students/:id/review-schedule",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const schedule =
        await prisma.wordMemoryState.findMany({
          where: {
            userId: req.params.id,
          },
          include: {
            word: true,
          },
          orderBy: {
            nextReviewAt: "asc",
          },
        });

      return res.status(200).json(schedule);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// GLOBAL RETENTION
// =========================

router.get(
  "/analytics/retention",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const retention =
        await prisma.wordMemoryState.aggregate({
          _avg: {
            predictedRecall: true,
            predictedHalfLife: true,
          },
          _min: {
            predictedRecall: true,
          },
          _max: {
            predictedRecall: true,
          },
        });

      return res.status(200).json(retention);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// HARDEST VOCABULARY
// =========================

router.get(
  "/analytics/hardest-vocabulary",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const result =
        await prisma.flashCardAttempt.findMany({
          include: {
            word: true,
          },
          orderBy: {
            correctReviews: "asc",
          },
          take: 20,
        });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

// =========================
// HSK DISTRIBUTION
// =========================

router.get(
  "/analytics/hsk-distribution",
  validateToken,
  validateTeacher,
  async (req, res) => {
    try {
      const levels = await prisma.mandarinWord.groupBy({
        by: ["hskLevel"],
        _count: true,
      });

      return res.status(200).json(levels);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
);

export default router;