import {
  getTeacherDashboardRepository,
  getCountMandarinWordsRepository,
  CountDistinctHskLevelsRepository,
  getCountMandarinMeaningRepository,
} from "../../../repositories/teacher/dashboard/teacherDashboard.repository.js";

export const teacherDashboardService = async () => {
  console.log("-----------------Hit Service");
  const result = await getTeacherDashboardRepository();

  return result;
};

export const teacherVocabularyStatsService = async ()=>{

  const countMandarin = await getCountMandarinWordsRepository();
  const countHskTotal = await CountDistinctHskLevelsRepository();
  const countMandarinMeaning = await getCountMandarinMeaningRepository();

  return {
    countMandarin,
    countHskTotal,
    countMandarinMeaning
  }

};