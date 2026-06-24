import { PrismaClient } from "@prisma/client";
import path from "path";
import XLSX from "xlsx";

const prisma = new PrismaClient();

type ExcelRow = {
  simplified: string;
  pinyin_tone: string;
  pos?: string;
  hskLevel: number;
  radical?: string;
  lexicalDifficulty?: number;
  english?: string;
};

async function loadExcel(): Promise<ExcelRow[]> {
  const filePath = path.join(
    process.cwd(),
    "prisma",
    "dataset-words",
    "mandarin_words.xlsx"
  );

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<ExcelRow>(
    worksheet
  );
}

async function main() {
  console.log("🗑 Cleaning database...");

  await prisma.mandarinMeaning.deleteMany();
  await prisma.mandarinWord.deleteMany();

  console.log("📖 Reading Excel...");

  const rows = await loadExcel();

  console.log(
    `✅ Loaded ${rows.length} rows`
  );

  const uniqueRows = [
    ...new Map(
      rows.map((row) => [
        row.simplified?.trim(),
        row,
      ])
    ).values(),
  ];

  console.log(
    `✅ Unique words: ${uniqueRows.length}`
  );

  const meaningData: {
    wordId: string;
    meaning: string;
  }[] = [];

  let counter = 0;

  console.log("📥 Inserting words...");

  for (const row of uniqueRows) {
    const simplified =
      row.simplified?.trim();

    if (!simplified) continue;

    const word =
      await prisma.mandarinWord.create({
        data: {
          simplified,

          pinyin:
            row.pinyin_tone || "",

          pos:
            row.pos?.trim() || null,

          radical:
            row.radical?.trim() || null,

          hskLevel:
            Number(row.hskLevel) || 0,

          lexicalDifficulty:
            row.lexicalDifficulty != null
              ? Number(
                  row.lexicalDifficulty
                )
              : null,
        },

        select: {
          id: true,
        },
      });

    const meanings =
      String(row.english || "")
        .split(/\s*;\s*/)
        .map((m) => m.trim())
        .filter(Boolean);

    for (const meaning of meanings) {
      meaningData.push({
        wordId: word.id,
        meaning,
      });
    }

    counter++;

    if (counter % 100 === 0) {
      console.log(
        `Inserted ${counter}/${uniqueRows.length}`
      );
    }
  }

  console.log("📥 Inserting meanings...");

  if (meaningData.length > 0) {
    await prisma.mandarinMeaning.createMany({
      data: meaningData,
    });
  }

  const totalWords =
    await prisma.mandarinWord.count();

  const totalMeanings =
    await prisma.mandarinMeaning.count();

  console.log("\n🎉 Seed completed");
  console.log(`Words    : ${totalWords}`);
  console.log(`Meanings : ${totalMeanings}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });