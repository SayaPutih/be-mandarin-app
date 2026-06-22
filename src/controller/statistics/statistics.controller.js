import { getStatisticService } from "../../service/statistic/statistic.service.js";

export const getStatisticController = async (req, res) => {
  const result = await getStatisticService(req.user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};
