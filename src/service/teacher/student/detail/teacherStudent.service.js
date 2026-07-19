import {
  getStudentsRepository,
  getStudentByIdRepository,
  getStudentRetentionRepository,
  getStudentMasteredWordsRepository,
  getStudentForgottenWordsRepository,
  getStudentReviewScheduleRepository,
} from "../../../../repositories/teacher/student/detail/teacherStudent.repository.js";

export const teacherGetStudentsService = async () => {
  return await getStudentsRepository();
};

export const teacherGetStudentDetailService = async (id) => {
  const student = await getStudentByIdRepository(id);

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};

export const teacherGetStudentRetentionService = async (userId) => {
  return await getStudentRetentionRepository(userId);
};

export const teacherGetStudentMasteredWordsService = async (userId) => {
  return await getStudentMasteredWordsRepository(userId);
};

export const teacherGetStudentForgottenWordsService = async (userId) => {
  return await getStudentForgottenWordsRepository(userId);
};

export const teacherGetStudentReviewScheduleService = async (userId) => {
  return await getStudentReviewScheduleRepository(userId);
};
