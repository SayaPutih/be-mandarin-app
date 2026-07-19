import {
  createClassRepository,
  getClassesRepository,
  deleteClassRepository,
} from "../../../repositories/teacher/class/teacherClass.repository.js";

export const teacherClassCreateService = async (
  name,
  description,
  teacherId,
) => {
  const result = await createClassRepository(name, description, teacherId);
  return result;
};

export const teacherClassGetService = async (teacherId, page, limit) => {
  const result = await getClassesRepository(teacherId, page, limit);
  return result;
};

export const deleteClassService = async (classId) => {
  return await deleteClassRepository(classId);
};
