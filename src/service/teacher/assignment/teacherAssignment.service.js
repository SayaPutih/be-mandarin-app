import {
  createAssignmentRepository,
  getAssignmentsRepository,
  getAssignmentDetailRepository,
  updateAssignmentRepository,
  removeAssignmentRepository,
  getUpdateAssignmentRepository,
  getAssignmentCardsRepository,
  getAssignmentStudentsRepository,
} from "../../../repositories/teacher/assignment/teacherAssignment.repository.js";

export const createAssignmentService = async ({
  classId,
  title,
  description,
  dueDate,
  wordIds,
}) => {
  return await createAssignmentRepository({
    classId,
    title,
    description,
    dueDate,
    wordIds,
  });
};

export const getAssignmentsByClassService = async (classId) => {
  return await getAssignmentsRepository(classId);
};

export const getAssignmentDetailService = async (assignmentId, teacherId) => {
  const assignment = await getAssignmentDetailRepository(
    assignmentId,
    teacherId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  const completedStudents = assignment.progresses.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  const inProgressStudents = assignment.progresses.filter(
    (p) => p.status === "IN_PROGRESS",
  ).length;

  const notStartedStudents = assignment.progresses.filter(
    (p) => p.status === "NOT_STARTED",
  ).length;

  return {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt,
    class: assignment.class,
    totalCards: assignment._count.assignmentCards,
    totalStudents: assignment._count.progresses,
    completedStudents,
    inProgressStudents,
    notStartedStudents,
  };
};

export const updateAssignmentService = async ({
  assignmentId,
  title,
  description,
  dueDate,
  wordIds,
}) => {
  return await updateAssignmentRepository({
    assignmentId,
    title,
    description,
    dueDate,
    wordIds,
  });
};

export const removeAssignmentService = async (id) => {
  return removeAssignmentRepository(id);
};

export const getUpdateAssignmentService = async (assignmentId, teacherId) => {
  const assignment = await getUpdateAssignmentRepository(
    assignmentId,
    teacherId,
  );

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  return assignment;
};

export const getAssignmentCardsService = async (
  assignmentId,
  teacherId,
  query,
) => {
  return getAssignmentCardsRepository(assignmentId, teacherId, query);
};

export const getAssignmentStudentsService = async (
  assignmentId,
  teacherId,
  query,
) => {
  return getAssignmentStudentsRepository(assignmentId, teacherId, query);
};