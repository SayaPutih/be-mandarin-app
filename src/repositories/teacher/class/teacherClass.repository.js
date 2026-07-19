import prisma from "../../../config/prisma.js";

export const createClassRepository = async (name, description, teacherId) => {
  console.log(" -- Creating New Class -- ");

  return await prisma.class.create({
    data: {
      name,
      description,
      teacherId,
    },
  });
};

export const getClassesRepository = async (teacherId, page = 1, limit = 10) => {
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

export const deleteClassRepository = async (classId) => {
  return await prisma.$transaction(async (tx) => {
    const assignments = await tx.assignment.findMany({
      where: {
        classId,
      },
      select: {
        id: true,
      },
    });

    const assignmentIds = assignments.map((a) => a.id);

    if (assignmentIds.length > 0) {
      await tx.assignmentProgress.deleteMany({
        where: {
          assignmentId: {
            in: assignmentIds,
          },
        },
      });

      await tx.assignmentCard.deleteMany({
        where: {
          assignmentId: {
            in: assignmentIds,
          },
        },
      });

      await tx.assignment.deleteMany({
        where: {
          id: {
            in: assignmentIds,
          },
        },
      });
    }

    await tx.enrollment.deleteMany({
      where: {
        classId,
      },
    });

    return await tx.class.delete({
      where: {
        id: classId,
      },
    });
  });
};