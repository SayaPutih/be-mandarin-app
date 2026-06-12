import { answerFlashCardQuestionsService } from "../../service/flash-card/flash-card-answer.service.js";

export const answerFlashCardController =async (req,res)=>{
    try{

        const user_id = req.user.id;
        const body = req.body;

        const result = await answerFlashCardQuestionsService(
            req.user.id,
            body.wordId,
            body.answer,
            body.expected_answer,
            body.answerTimeMs
        );

        return res.status(200).json({
            success : true,
            data : result
        })

    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}