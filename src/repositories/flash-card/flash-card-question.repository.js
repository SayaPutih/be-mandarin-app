import prisma from "../../config/prisma.js";
import { getCurrentSystemDate } from "../system-config.repository.js";

// export const GetMcQuestion = async (hskLevel) => {
//   const result = await prisma.$queryRaw`
//         SELECT
//             mw.id,
//             mw.simplified,
//             mw.pinyin,
//             mw."hskLevel",
//             STRING_AGG(mm.meaning, '=|=') AS meanings,
//             mw."lexicalDifficulty"
//         FROM "MandarinWord" mw
//         LEFT JOIN "MandarinMeaning" mm
//             ON mm."wordId" = mw.id
//         GROUP BY
//             mw.id,
//             mw.simplified,
//             mw.pinyin,
//             mw."hskLevel"
//         ORDER BY RANDOM()
//         LIMIT 1;
//     `;

//   return result[0];
// };


export const GetMcQuestion = async (hskLevel) => {
  const result = await prisma.$queryRaw`
      SELECT
          mw.id,
          mw.simplified,
          mw.pinyin,
          mw."hskLevel",
          STRING_AGG(
            mm.meaning,
            '=|='
          ) AS meanings,
          mw."lexicalDifficulty"
      FROM "MandarinWord" mw
      LEFT JOIN "MandarinMeaning" mm
          ON mm."wordId" = mw.id
      WHERE mw."hskLevel" = ${hskLevel}
      GROUP BY
          mw.id,
          mw.simplified,
          mw.pinyin,
          mw."hskLevel",
          mw."lexicalDifficulty"
      ORDER BY RANDOM()
      LIMIT 1;
    `;

  return result[0];
};


export const GetMcQuestionById = async (wordId) => {
  const result = await prisma.$queryRaw`
        SELECT
            mw.id,
            mw.simplified,
            mw.pinyin,
            mw."hskLevel",
            STRING_AGG(mm.meaning, '=|=') AS meanings,
            mw."lexicalDifficulty"
        FROM "MandarinWord" mw
        
        LEFT JOIN "MandarinMeaning" mm
            ON mm."wordId" = mw.id

        WHERE mw.id = ${wordId}

        GROUP BY
            mw.id,
            mw.simplified,
            mw.pinyin,
            mw."hskLevel"
        ORDER BY RANDOM()
        LIMIT 1;
    `;

  return result[0];
};



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

  const currentDate = await getCurrentSystemDate();

  return prisma.wordMemoryState.findMany({
    where: {
      userId,
      nextReviewAt: {
        lte: currentDate,
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


export const GetInitiation = async (
  listWords,
  limit
) => {
  return prisma.mandarinWord.findMany({
    where: {
      id: {
        notIn: listWords,
      },
    },

    include: {
      meanings: true,
    },

    orderBy: {
      lexicalDifficulty: "asc",
    },

    take: limit,
  });
};