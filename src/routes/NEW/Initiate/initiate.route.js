import { validateToken } from "../../../middleware/validateToken.js";
import {
  findUserFlashCardInteractionWords,
  GetInitiation,
  GetMcOptions,
} from "./repo.js";
import { shuffle } from "../../../utils/shuffle.js";
import express from "express";

const router = express.Router();




router.get("/new-initiate",validateToken, async (req,res)=>{
    try{
    
        const userInteractions = await findUserFlashCardInteractionWords(
          req.user.id,
        );

        const INITIAL_BATCH = 20;
        const howManyMore = INITIAL_BATCH - userInteractions.length;

        if (howManyMore <= 0) {
          return [];
        }

        const answeredWords = userInteractions.map((a) => a.wordId);
        const flashCards = await GetInitiation(
            answeredWords,
            howManyMore
          );

        const initiateBatch = [];


        for (const flashCardHanzi of flashCards) {
            const options = await GetMcOptions(
              flashCardHanzi.id,
              3
            );
        
            const meanings =
              flashCardHanzi.meanings.map(
                (m) => m.meaning
              );
        
            const correctMeaning =
              meanings[
                Math.floor(
                  Math.random() * meanings.length
                )
              ];
        
            const randomizedArray = shuffle([
              correctMeaning,
              ...options.map((x) => x.meaning),
            ]);
        
            initiateBatch.push({
              id: flashCardHanzi.id,
        
              hanzi:
                flashCardHanzi.simplified,
        
              pinyin:
                flashCardHanzi.pinyin,
        
              meanings,
        
              options: randomizedArray,
        
              hskLevel:
                flashCardHanzi.hskLevel,
        
              lexicalDifficulty:
                flashCardHanzi.lexicalDifficulty,
        
              expectedAnswer:
                correctMeaning,
            });
          }
        
        const need = 20 - initiateBatch.length

        return res.status(200).json({
          success: true,
          data: initiateBatch,
          total: initiateBatch.length,
          need: initiateBatch.length,
        });
      }catch(err){
        return res.status(500).json({
          message: err.message,
        });
      }
})

export default router;


//Initiate
//Asnwer
//Review

//Bab 1
//Bab2 Quesiton
//blackBox
//Get Question

//Insert Database 

//Flowchart
//Low Fid

//High Fid