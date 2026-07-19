import prisma from "../../../config/prisma.js";

export const getVocabularyRepository = async (page, limit) => {
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

  return {
    data: words,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getVocabularyByIdRepository = async (id) => {
  return await prisma.mandarinWord.findUnique({
    where: {
      id,
    },
    include: {
      meanings: true,
    },
  });
};

export const getVocabularyBySimplifiedRepository = async (simplified) => {
  return await prisma.mandarinWord.findUnique({
    where: {
      simplified,
    },
  });
};

export const createVocabularyRepository = async (data) => {
  return await prisma.$transaction(async (tx) => {
    const word = await tx.mandarinWord.create({
      data: {
        simplified: data.simplified,
        pinyin: data.pinyin,
        hskLevel: data.hskLevel,
        pos: data.pos,
        radical: data.radical,
        lexicalDifficulty: data.lexicalDifficulty,
      },
    });

    if (data.meanings?.length) {
      await tx.mandarinMeaning.createMany({
        data: data.meanings.map((meaning) => ({
          wordId: word.id,
          meaning,
        })),
      });
    }

    return word;
  });
};

export const updateVocabularyRepository = async (id, data) => {
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.mandarinWord.update({
      where: {
        id,
      },
      data: {
        simplified: data.simplified,
        pinyin: data.pinyin,
        hskLevel: data.hskLevel,
        pos: data.pos,
        radical: data.radical,
        lexicalDifficulty: data.lexicalDifficulty,
      },
    });

    await tx.mandarinMeaning.deleteMany({
      where: {
        wordId: id,
      },
    });

    if (data.meanings?.length) {
      await tx.mandarinMeaning.createMany({
        data: data.meanings.map((meaning) => ({
          wordId: id,
          meaning,
        })),
      });
    }

    return updated;
  });
};

export const deleteVocabularyRepository = async (id) => {
  try {
    console.log("Hit Delete", id);

    await prisma.$transaction(async (tx) => {
      const attempts = await tx.flashCardAttempt.findMany({
        where: { wordId: id },
        select: { id: true },
      });

      const attemptIds = attempts.map((a) => a.id);

      await tx.flashCardAttemptLog.deleteMany({
        where: {
          flashcardAttemptId: {
            in: attemptIds,
          },
        },
      });

      await tx.flashCardAttempt.deleteMany({
        where: {
          wordId: id,
        },
      });

      await tx.wordMemoryState.deleteMany({
        where: {
          wordId: id,
        },
      });

      await tx.assignmentCard.deleteMany({
        where: {
          wordId: id,
        },
      });

      await tx.mandarinMeaning.deleteMany({
        where: {
          wordId: id,
        },
      });

      await tx.mandarinWord.delete({
        where: {
          id,
        },
      });
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};