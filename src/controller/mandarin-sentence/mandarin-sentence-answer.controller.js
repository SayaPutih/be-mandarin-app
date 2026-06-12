import { mandarinSentenceAnswerService } from "../../service/mandarin-sentence/mandarin-sentence-answer.service.js";

export const mandarinSentenceAnswerController = async (req,res)=>{
    try{

        const userId = req.user.id; 
        const { questionId, englishSentence } = req.body;

        const result = await mandarinSentenceAnswerService({
          userId,
          questionId,
          englishSentence,
        });

        return res.status(200).json({
          success: true,
          data: result,
        });
    }catch(err){
        return res.status(500).json({err : err.message});
    }
}