import prisma from "../../config/prisma.js";

export const getStudentClasses = async (
  studentId
) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
    },
    include: {
      class: {
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  console.log("Enrollment Count:", enrollments.length);
  console.log(enrollments);

  return enrollments.map((enrollment) => enrollment.class);
};

export const getAssignmentsByClass = async (
  classId,
  page,
  limit,
  studentId,
) => {

  const skip = (page - 1) * limit;

  const [assignments, total] = await Promise.all([

    prisma.assignment.findMany({
      where: {
        classId,
      },
      include: {
        _count: {
          select: {
            assignmentCards: true,
          },
        },
        progresses: {
          where: {
            studentId,
          },
          select: {
            status: true,
            completionPercentage: true,
            completedCards: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.assignment.count({
      where: {
        classId,
      },
    }),

  ]);

  return {
    assignments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getAssignmentCards = async (
  assignmentId,
) => {

  return await prisma.assignmentCard.findMany({

    where: {
      assignmentId,
    },

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

  });

};