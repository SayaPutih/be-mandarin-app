import prisma from "../../../config/prisma.js";

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

export const getAssignmentDetailRepository = async (assignmentId, teacherId) => {
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

export const updateAssignmentRepository = async ({
  assignmentId,
  title,
  description,
  dueDate,
  wordIds,
}) => {
  return prisma.$transaction(async (tx) => {
    const assignment = await tx.assignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        title,
        description,
        dueDate,
      },
    });

    await tx.assignmentCard.deleteMany({
      where: {
        assignmentId,
      },
    });

    await tx.assignmentCard.createMany({
      data: wordIds.map((wordId) => ({
        assignmentId,
        wordId,
      })),
    });

    return assignment;
  });
};

export const removeAssignmentRepository = async (id) => {
  return await prisma.assignment.deleteMany({
    where: { id },
  });
};

export const getUpdateAssignmentRepository = async (
  assignmentId,
  teacherId,
) => {
  return prisma.assignment.findFirst({
    where: {
      id: assignmentId,

      class: {
        teacherId,
      },
    },

    include: {
      assignmentCards: {
        include: {
          word: {
            include: {
              meanings: true,
            },
          },
        },
      },
    },
  });
};

export const getAssignmentCardsRepository = async (
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

export const getAssignmentStudentsRepository = async (
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