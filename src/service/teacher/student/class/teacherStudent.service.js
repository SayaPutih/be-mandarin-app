import {
  addStudentRepository,
  getAvailableStudentsRepository,
  removeStudentRepository,
  getWordsRepository,
  getStudentsByClassRepository,
} from "../../../../repositories/teacher/student/class/teacherStudent.repository.js";

export const getStudentsByClassService = async (classId) => {
  console.log("HIT STUDENTS SERVICE ALL");
  return await getStudentsByClassRepository(classId);
};

export const addStudentToClassService = async ({ classId, studentIds }) => {
  return await addStudentRepository({
    classId,
    studentIds,
  });
};

export const getAvailableStudentsService = async ({ classId, search }) => {
  return await getAvailableStudentsRepository({
    classId,
    search,
  });
};

export const removeStudentFromClassService = async ({ classId, studentId }) => {
  return await removeStudentRepository({
    classId,
    studentId,
  });
};

export const getWordsService = async (params) => {
  return await getWordsRepository(params);
};






