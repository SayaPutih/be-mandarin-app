import prisma from "../../config/prisma.js";

export const GetMcQuestion = async ()=>{


    const result = await prisma.$queryRaw`
        SELECT
            mw.id,
            mw.simplified,
            mw.pinyin,
            mw."hskLevel",
            STRING_AGG(mm.meaning, '=|=') AS meanings
        FROM "MandarinWord" mw
        LEFT JOIN "MandarinMeaning" mm
            ON mm."wordId" = mw.id
        GROUP BY
            mw.id,
            mw.simplified,
            mw.pinyin,
            mw."hskLevel"
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    return result[0];
}

export const GetMcOptions = async (id,limit)=>{
    return await prisma.$queryRaw`
        select 
            meaning
        from "MandarinMeaning" 
        where "wordId" <> ${id}
        order by RANDOM() limit ${limit}
    `;
}


export const GetReviewWords = async (userId) => {
  return prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        lte: new Date(),
      },
    },
    include: {
      word: {
        include: {
          meanings: true,
        },
      },
    },
    orderBy: {
      nextReviewAt: "asc",
    },
  });
};

