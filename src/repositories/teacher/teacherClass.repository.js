import prisma from "../../config/prisma.js";

export const createClass = async (name, description, teacherId) => {
  console.log(" -- Creating New Class -- ");

  return await prisma.class.create({
    data: {
      name,
      description,
      teacherId,
    },
  });
};

export const getClasses = async (teacherId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      where: {
        teacherId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,

      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    }),

    prisma.class.count({
      where: {
        teacherId,
      },
    }),
  ]);

  return {
    classes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

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

export const getAssignmentsRepository = async (classId) => {
  return prisma.assignment.findMany({
    where: {
      classId,
    },

    include: {
      assignmentCards: true,
      progresses: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createAssignmentRepository = async ({
  classId,
  title,
  description,
  dueDate,
  wordIds,
}) => {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.create({
      data: {
        classId,
        title,
        description,
        dueDate,
      },
    });

    await tx.assignmentCard.createMany({
      data: wordIds.map((wordId) => ({
        assignmentId: assignment.id,
        wordId,
      })),
    });

    return assignment;
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

export const getAssignmentDetail = async (assignmentId, teacherId) => {
  return prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      class: {
        teacherId,
      },
    },
    include: {
      class: {
        select: {
          id: true,
          name: true,
        },
      },

      _count: {
        select: {
          assignmentCards: true,
          progresses: true,
        },
      },

      progresses: {
        select: {
          status: true,
        },
      },
    },
  });
};

export const getAssignmentCards = async (
  assignmentId,
  teacherId,
  { hanzi, pinyin, meaning, hskLevel, page, limit = 10 },
) => {
  const where = {
    assignmentId,

    assignment: {
      class: {
        teacherId,
      },
    },

    word: {},
  };

  if (hanzi) {
    where.word.simplified = {
      contains: hanzi,
      mode: "insensitive",
    };
  }

  if (pinyin) {
    where.word.pinyin = {
      contains: pinyin,
      mode: "insensitive",
    };
  }

  if (meaning) {
    where.word.meanings = {
      some: {
        meaning: {
          contains: meaning,
          mode: "insensitive",
        },
      },
    };
  }
  if (hskLevel) {
    where.word.hskLevel = Number(hskLevel);
  }
  const skip = (page - 1) * limit;
  const [cards, total] = await prisma.$transaction([
    prisma.assignmentCard.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        word: {
          include: {
            meanings: true,
          },
        },
      },
      orderBy: {
        word: {
          simplified: "asc",
        },
      },
    }),
    prisma.assignmentCard.count({
      where,
    }),
  ]);

  return {
    cards,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getAssignmentStudents = async (
  assignmentId,
  teacherId,
  { search, status, page = 1, limit = 10 },
) => {
  const where = {
    assignmentId,
    assignment: {
      class: {
        teacherId,
      },
    },
    student: {},
  };

  if (search) {
    where.student.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;

  const [students, total] = await prisma.$transaction([
    prisma.assignmentProgress.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        student: {
          name: "asc",
        },
      },
    }),

    prisma.assignmentProgress.count({
      where,
    }),
  ]);

  return {
    students,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const removeAssignment = async (
  id
) => {
  console.log("Repository");
  return await prisma.assignment.deleteMany({
    where : {id}
  })

};