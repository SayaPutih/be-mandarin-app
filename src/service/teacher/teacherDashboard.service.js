import { getTeacherDashboard } from "../../repositories/teacher/teacherDashboard.repository.js";

export const teacherDashboardService = async () => {
  const result = await getTeacherDashboard();

  return result;
};
