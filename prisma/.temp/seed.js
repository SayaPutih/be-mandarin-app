import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  const rows = [];

  const csvPath = path.join(process.cwd(), "prisma", "hsk_master_v2.csv");

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
        }),
      )
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Found ${rows.length} rows`);

  const data = rows.map((row) => ({
    simplified: row.simplified,
    traditional: row.traditional,
    pinyin: row.pinyin,
    zhuyin: row.zhuyin || null,
    meaning: row.meaning,

    hskLevel: row.hsk_level,
    hskLevelMain: row.hsk_level_main,

    pos: row.pos,

    frequencyHsk: BigInt(row.frequency_hsk),
    frequencyRankHsk: Number(row.frequency_rank_hsk),

    frequencySubtlex: row.frequency_subtlex
      ? Number(row.frequency_subtlex)
      : null,

    frequencyRankSubtlex: row.frequency_rank_subtlex
      ? Number(row.frequency_rank_subtlex)
      : null,

    perMillion: row.per_million ? Number(row.per_million) : null,

    logFrequency: row.log_frequency ? Number(row.log_frequency) : null,

    contextDiversity: row.context_diversity
      ? Number(row.context_diversity)
      : null,

    contextDiversityPct: row.context_diversity_pct
      ? Number(row.context_diversity_pct)
      : null,

    logContextDiversity: row.log_context_diversity
      ? Number(row.log_context_diversity)
      : null,

    inSubtlex: String(row.in_subtlex).toLowerCase() === "true",
  }));

  console.log("Starting insert...");

  const result = await prisma.mandarinWord.createMany({
    data,
  });

  console.log("Inserted:", result.count);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
