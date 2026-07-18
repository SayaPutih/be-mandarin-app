import {
  getStudents,
  getStudentById,
  getStudentRetention,
  getStudentMasteredWords,
  getStudentForgottenWords,
  getStudentReviewSchedule,
} from "../../repositories/teacher/teacherStudent.repository.js";

export const teacherGetStudentsService = async () => {
  return await getStudents();
};

export const teacherGetStudentDetailService = async (id) => {
  const student = await getStudentById(id);

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};

export const teacherGetStudentRetentionService = async (userId) => {
  return await getStudentRetention(userId);
};

export const teacherGetStudentMasteredWordsService = async (userId) => {
  return await getStudentMasteredWords(userId);
};

export const teacherGetStudentForgottenWordsService = async (userId) => {
  return await getStudentForgottenWords(userId);
};

export const teacherGetStudentReviewScheduleService = async (userId) => {
  return await getStudentReviewSchedule(userId);
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