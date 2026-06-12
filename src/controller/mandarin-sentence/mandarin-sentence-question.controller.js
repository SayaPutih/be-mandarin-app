import { getMandarinSenteneQuestionService } from "../../service/mandarin-sentence/mandarin-sentence-question.service.js";

export const getMandarinSenteneQuestionController = async (req,res)=>{
    try{

        const request = await  getMandarinSenteneQuestionService();
        return res.status(200).json({
            success : true,
            data : request
        })

    }catch(err){
        return res.status(500).json({err : err.message});
    }
}