import { validateToken } from "../../middleware/validateToken.js";
import { validateTeacher } from "../../middleware/validateTeacher.js";
import express from "express";
import prisma from "../../config/prisma.js";

const router = express.Router();

router.post("/get-all-assignment", validateToken, async (req, res) => {
    try{

        const userId = req.user.id;

        const result = await prisma.teacherVocabularyList.findMany({
          where: {
            teacherId: userId,
          },
          include: {
            words: {
              include: {
                word: {
                  include: {
                    meanings: true,
                  },
                },
              },
            },
          },
        });

    }catch(err){
        return res.status(200).json({message : err.message})
    }
})

export default router;