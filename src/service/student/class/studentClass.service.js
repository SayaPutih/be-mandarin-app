import {
  getStudentClasses,
  getAssignmentsByClass,
  getAssignmentCards,
} from "../../../repositories/student/studentClass.repository.js";

export const getAllClassService = async (id)=>{
    return await getStudentClasses(id);
}

export const getAssignmentsByClassService = async (
  classId,
  studentId,
  page,
  limit,
) => {
  return await getAssignmentsByClass(classId, page, limit, studentId);
};

export const getAssignmentCardsService = async (assignmentId) => {
  return await getAssignmentCards(assignmentId);
};