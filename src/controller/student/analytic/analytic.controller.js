import {
  analyticsOverviewService,
  analyticsDifficultyService,
  analyticsRecentService,
  analyticsWordProgressService,
} from "../../../service/student/analyitc/analytic.service.js";

export const GetAnalyticsOverviewController = async (req, res) => {
  const data = await analyticsOverviewService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsDifficultyController = async (req, res) => {
  const data = await analyticsDifficultyService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsRecentController = async (req, res) => {
  const data = await analyticsRecentService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsWordProgressController = async (req, res) => {
  const data = await analyticsWordProgressService(req.user.id);

  res.json({
    success: true,
    data,
  });
};


export const getUserHalfLifeScoreController = async (req,res)=>{
  return 0
}