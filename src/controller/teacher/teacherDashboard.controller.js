import { getTeacherDashboard } from "../../repositories/teacher/teacherDashboard.repository.js";

export const teacherDashboardController = async (req, res) => {
  try {
    const result = await teacherDashboardService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
