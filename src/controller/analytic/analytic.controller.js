import {
  analyticsOverviewService,
  analyticsDifficultyService,
  analyticsRecentService,
  analyticsWordProgressService,
} from "../../service/analyitc/analytic.service.js";

export const GetAnalyticsOverview = async (req, res) => {
  const data = await analyticsOverviewService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsDifficulty = async (req, res) => {
  const data = await analyticsDifficultyService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsRecent = async (req, res) => {
  const data = await analyticsRecentService(req.user.id);

  res.json({
    success: true,
    data,
  });
};

export const GetAnalyticsWordProgress = async (req, res) => {
  const data = await analyticsWordProgressService(req.user.id);

  res.json({
    success: true,
    data,
  });
};


export const getUserHalfLifeScore = async (req,res)=>{
  return 0
}