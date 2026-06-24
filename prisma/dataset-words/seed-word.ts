import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

type CsvRow = Record<string, string>;

async function loadCsv(): Promise<CsvRow[]> {
  const rows: CsvRow[] = [];

  const csvPath = path.join(
    process.cwd(),
    "prisma",
    "dataset-words",
    "mandarin_words.xlsx"
  );

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            header.replace(/^\uFEFF/, ""),
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve())
      .on("error", reject);
  });

  return rows;
}

async function main() {
  console.log("🗑 Cleaning database...");

  //await prisma.mandarinSubtlex.deleteMany();
  await prisma.mandarinMeaning.deleteMany();
  await prisma.mandarinWord.deleteMany();

  console.log("📖 Reading CSV...");

  const rows = await loadCsv();

  console.log(`✅ Loaded ${rows.length} words`);

  const createdWords: {
    id: string;
    meanings: string[];
  }[] = [];

  let counter = 0;

  console.log("📥 Inserting words...");

for (const row of rows) {
  const simplified = row["simplified"]?.trim();

  if (!simplified) {
    continue;
  }

  const word =
    await prisma.mandarinWord.create({
      data: {
        simplified,

        pinyin:
          row["pinyin_tone"] || "",

        pos:
          row["pos"] || null,

        radical:
          row["radical"] || null,

        hskLevel:
          Number(row["hskLevel"]) || 0,

        lexicalDifficulty:
          row["lexicalDifficulty"]
            ? Number(
                row["lexicalDifficulty"]
              )
            : null,
      },

      select: {
        id: true,
      },
    });

  const meanings =
    row["english"]
      ?.split(/\s*;\s*/)
      .map((m) => m.trim())
      .filter(Boolean) ?? [];

  createdWords.push({
    id: word.id,
    meanings,
  });

  counter++;

  if (counter % 500 === 0) {
    console.log(
      `Inserted ${counter}/${rows.length}`
    );
  }
}

  console.log("📥 Inserting meanings...");

  const meaningData = createdWords.flatMap(
    (word) =>
      word.meanings.map((meaning) => ({
        wordId: word.id,
        meaning,
      }))
  );

  console.log(
    `Total meanings: ${meaningData.length}`
  );

  const chunkSize = 5000;

  for (
    let i = 0;
    i < meaningData.length;
    i += chunkSize
  ) {
    await prisma.mandarinMeaning.createMany({
      data: meaningData.slice(
        i,
        i + chunkSize
      ),
    });

    console.log(
      `Inserted meanings ${Math.min(
        i + chunkSize,
        meaningData.length
      )}/${meaningData.length}`
    );
  }

  const totalWords =
    await prisma.mandarinWord.count();

  const totalMeanings =
    await prisma.mandarinMeaning.count();

  // const totalSubtlex =
  //   await prisma.mandarinSubtlex.count();

  console.log("\n🎉 Seed completed");
  console.log(`Words    : ${totalWords}`);
  console.log(`Meanings : ${totalMeanings}`);
  //console.log(`Subtlex  : ${totalSubtlex}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });