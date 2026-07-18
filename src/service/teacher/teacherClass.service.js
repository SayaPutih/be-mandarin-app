import {
  createClass,
  getClasses,
  getStudentsByClassRepository,
  addStudentRepository,
  getAssignmentsRepository,
  createAssignmentRepository,
  getAvailableStudentsRepository,
  removeStudentRepository,
  getWordsRepository,
  getAssignmentDetail,
  getAssignmentCards,
  getAssignmentStudents,
  removeAssignment,
} from "../../repositories/teacher/teacherClass.repository.js";

export const teacherClassCreateService = async (
  name,
  description,
  teacherId,
) => {
  const result = await createClass(name, description, teacherId);
  return result;
};

export const teacherClassGetService = async (teacherId, page, limit) => {
  const result = await getClasses(teacherId, page, limit);
  return result;
};

export const getStudentsByClass = async (classId) => {
  return await getStudentsByClassRepository(classId);
};

export const addStudentToClass = async ({ classId, studentIds }) => {
  return await addStudentRepository({
    classId,
    studentIds,
  });
};

export const getAssignmentsByClass = async (classId) => {
  return await getAssignmentsRepository(classId);
};

export const createAssignment = async ({
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

export const getAvailableStudents = async ({ classId, search }) => {
  return await getAvailableStudentsRepository({
    classId,
    search,
  });
};

export const removeStudentFromClass = async ({ classId, studentId }) => {
  return await removeStudentRepository({
    classId,
    studentId,
  });
};

export const getWords = async (params) => {
  return await getWordsRepository(params);
};

export const getAssignmentDetailService = async (assignmentId, teacherId) => {
  const assignment = await getAssignmentDetail(assignmentId, teacherId);

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

export const getAssignmentCardsService = async (assignmentId, teacherId, query) => {
  return getAssignmentCards(assignmentId, teacherId, query);
};

export const getAssignmentStudentsService = async (assignmentId, teacherId, query) => {
  return getAssignmentStudents(assignmentId, teacherId, query);
};

export const removeAssignmentService = async (id) => {
  return removeAssignment(id);
};