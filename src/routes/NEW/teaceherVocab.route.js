import { validateToken } from "../../middleware/validateToken.js";
import { validateTeacher } from "../../middleware/validateTeacher.js";
import express from "express";
import prisma from "../../config/prisma.js";

const router = express.Router();


// model TeacherVocabularyList {
//   id          String   @id @default(uuid())
//   teacherId   String
//   title       String
//   description String?
//   assignedAt  DateTime @default(now())

//   teacher User @relation(fields: [teacherId], references: [id])

//   words TeacherVocabularyListItem[]
// }


// model TeacherVocabularyListItem {
//   id      String @id @default(uuid())

//   listId  String
//   wordId  String

//   list TeacherVocabularyList @relation(fields: [listId], references: [id], onDelete: Cascade)

//   word MandarinWord @relation(fields: [wordId], references: [id], onDelete: Cascade)

//   @@unique([listId, wordId])
// }

// {
//   "title": "HSK 1 Lesson 1",
//   "description": "Greeting",
//   "wordIds": [
//     "uuid-word-1",
//     "uuid-word-2",
//     "uuid-word-3",
//     "uuid-word-4"
//   ]
// }

router.post("/list", validateToken, validateTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { title, description, wordIds } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title required",
      });
    }

    const list = await prisma.teacherVocabularyList.create({
      data: {
        teacherId,
        title,
        description,
      },
    });

    if (wordIds?.length > 0) {
      await prisma.teacherVocabularyListItem.createMany({
        data: wordIds.map((wordId) => ({
          listId: list.id,
          wordId,
        })),
        skipDuplicates: true,
      });
    }

    return res.status(201).json({
      message: "List created",
      listId: list.id,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});


export default router;
