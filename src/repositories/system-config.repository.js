// repositories/system-config.repository.js

import prisma from "../config/prisma.js";

export const getCurrentSystemDate = async () => {
  const config = await prisma.systemConfig.findFirst();

  return new Date(config?.currentReviewDate ?? Date.now());
};

