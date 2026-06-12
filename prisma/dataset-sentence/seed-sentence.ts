import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  const rows = [];

  const csvPath = path.join(
    process.cwd(),
    "prisma",
    "dataset-sentence",
    "chinese_english_pinyin_hsk.csv",
  );

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

  console.log(`TOTAL ROWS: ${rows.length}`);

  console.log("\nHEADERS:");
  console.log(Object.keys(rows[0]));

  console.log("\nFIRST ROW:");
  console.log(rows[0]);

  const data = rows
    .map((row) => ({
      englishTranslation: row.english?.trim() || "",
      hskLevel: Number(row.hsk) || 1,
      mandarinText: row.mandarin?.trim() || "",
      pinyin: row.pinyin?.trim() || "",
    }))
    .filter((row) => row.englishTranslation && row.mandarinText && row.pinyin);

  console.log("\nFIRST PARSED ROW:");
  console.log(data[0]);

  console.log("\nCLEARING TABLE...");

  await prisma.mandarinSentence.deleteMany();

  console.log("TABLE CLEARED");

  const batchSize = 1000;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    await prisma.mandarinSentence.createMany({
      data: batch,
    });

    console.log(
      `Inserted ${Math.min(i + batchSize, data.length)}/${data.length}`,
    );
  }

  const sample = await prisma.mandarinSentence.findFirst();

  console.log("\nDATABASE SAMPLE:");
  console.log(sample);

  console.log("\nDONE");

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
