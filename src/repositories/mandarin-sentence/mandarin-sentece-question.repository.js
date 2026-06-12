import prisma from "../../config/prisma.js";

export const getSentence = async (total) => {
  const result = await prisma.$queryRaw`
        SELECT
            id,
            "englishTranslation",
            "hskLevel",
            "mandarinText"
        FROM "MandarinSentence"
        ORDER BY RANDOM()
        LIMIT ${total}
    `;

  //return result?.[0] ?? null;
  return result ?? null;
};

export const getSentenceById = async (id)=>{
  return await prisma.mandarinSentence.findFirst({
    where : {
      id 
    }
  })
}