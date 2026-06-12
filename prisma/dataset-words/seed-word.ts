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
    "mandarin_word_dataset_final.csv"
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

  await prisma.mandarinSubtlex.deleteMany();
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

    const word = await prisma.mandarinWord.create({
      data: {
        simplified,

        simplifiedNormalized:
          row["simplified_normalized"] || null,

        traditional:
          row["traditional"] || null,

        pinyin:
          row["pinyin"] || "",

        pos:
          row["pos"] || null,

        radical:
          row["radical"] || null,

        hskLevel:
          Number(row["hsk_level"]) || 0,

        defFrequency:
          Number(row["frequency"]) || 0,
      },
      select: {
        id: true,
      },
    });

    // =====================
    // DRKAMELOEN MEANINGS
    // =====================

    const meanings =
      row["meaning"]
        ?.split(";")
        .map((m) => m.trim())
        .filter(Boolean) ?? [];

    createdWords.push({
      id: word.id,
      meanings,
    });

    // =====================
    // SUBTLEX
    // =====================

    if (row["subtlex_word"]) {
      await prisma.mandarinSubtlex.create({
        data: {
          wordId: word.id,

          wordRaw:
            row["subtlex_word"] || null,

          length:
            row["subtlex_length"]
              ? Number(row["subtlex_length"])
              : null,

          pinyin:
            row["subtlex_pinyin"] || null,

          pinyinInput:
            row["subtlex_pinyin_input"] || null,

          wCount:
            row["subtlex_w_count"]
              ? Number(row["subtlex_w_count"])
              : null,

          wMillion:
            row["subtlex_w_million"]
              ? Number(row["subtlex_w_million"])
              : null,

          log10W:
            row["subtlex_log10w"]
              ? Number(row["subtlex_log10w"])
              : null,

          wCd:
            row["subtlex_w_cd"]
              ? Number(row["subtlex_w_cd"])
              : null,

          wCdPercent:
            row["subtlex_w_cd_percent"]
              ? Number(row["subtlex_w_cd_percent"])
              : null,

          log10CD:
            row["subtlex_log10cd"]
              ? Number(row["subtlex_log10cd"])
              : null,

          dominantPos:
            row["subtlex_dominant_pos"] || null,

          dominantPosFreq:
            row["subtlex_dominant_pos_freq"]
              ? Number(
                  row["subtlex_dominant_pos_freq"]
                )
              : null,

          allPos:
            row["subtlex_all_pos"] || null,

          allPosFreq:
            row["subtlex_all_pos_freq"] || null,

          englishTranslate:
            row["subtlex_eng_tran"] || null,

          wordNormalized:
            row["subtlex_word_normalized"] || null,
        },
      });
    }

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

  const totalSubtlex =
    await prisma.mandarinSubtlex.count();

  console.log("\n🎉 Seed completed");
  console.log(`Words    : ${totalWords}`);
  console.log(`Meanings : ${totalMeanings}`);
  console.log(`Subtlex  : ${totalSubtlex}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });