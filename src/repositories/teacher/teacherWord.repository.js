import prisma from "../../config/prisma.js";

export const getVocabulary = async (page, limit) => {
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

export const getVocabularyById = async (id) => {
  return await prisma.mandarinWord.findUnique({
    where: {
      id,
    },
    include: {
      meanings: true,
    },
  });
};

export const getVocabularyBySimplified = async (simplified) => {
  return await prisma.mandarinWord.findUnique({
    where: {
      simplified,
    },
  });
};

export const createVocabulary = async (data) => {
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

export const updateVocabulary = async (id, data) => {
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

export const deleteVocabulary = async (id) => {
  return await prisma.mandarinWord.delete({
    where: {
      id,
    },
  });
};