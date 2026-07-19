import {
  teacherDashboardService,
  teacherVocabularyStatsService,
} from "../../../service/teacher/dashboard/teacherDashboard.service.js";

export const teacherDashboardController = async (req, res) => {
  try {
    console.log("-----------------Hit")
    const result = await teacherDashboardService();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherVocabularyStatsController = async(req,res)=>{
  try {
    const result = await teacherVocabularyStatsService();
    console.log(result);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
