import prisma from "../../../../config/prisma.js";

export const getStudentsByClassRepository = async (classId) => {
  return prisma.enrollment.findMany({
    where: {
      classId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const addStudentRepository = async ({ classId, studentIds }) => {
  return prisma.enrollment.createMany({
    data: studentIds.map((studentId) => ({
      classId,
      studentId,
    })),
    skipDuplicates: true,
  });
};

export const getAvailableStudentsRepository = async ({ classId, search }) => {
  return prisma.user.findMany({
    where: {
      role: "USER",

      enrollments: {
        none: {
          classId,
        },
      },
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const removeStudentRepository = async ({ classId, studentId }) => {
  return prisma.enrollment.delete({
    where: {
      classId_studentId: {
        classId,
        studentId,
      },
    },
  });
};

export const getWordsRepository = async ({
  hanzi,
  pinyin,
  meaning,
  hskLevel,
  page = 1,
  limit = 20,
}) => {
  const where = {
    ...(hanzi && {
      simplified: {
        contains: hanzi,
        mode: "insensitive",
      },
    }),

    ...(pinyin && {
      pinyin: {
        contains: pinyin,
        mode: "insensitive",
      },
    }),

    ...(meaning && {
      meanings: {
        some: {
          meaning: {
            contains: meaning,
            mode: "insensitive",
          },
        },
      },
    }),

    ...(hskLevel && {
      hskLevel: Number(hskLevel),
    }),
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [words, total] = await prisma.$transaction([
    prisma.mandarinWord.findMany({
      where,

      include: {
        meanings: true,
      },

      orderBy: [
        {
          hskLevel: "asc",
        },
        {
          simplified: "asc",
        },
      ],

      skip,

      take: Number(limit),
    }),

    prisma.mandarinWord.count({
      where,
    }),
  ]);

  return {
    words,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
};







