import {
  getAllClassService,
  GetAssignmentsByClass,
  GetAssignmentCards,
} from "../../service/student/studentClass.service.js";

export const getAllClassController =async (req,res)=>{
    try{
        const id = req.user.id;
        const result = await getAllClassService(id);
        return res.status(200).json(result);
    }catch(err){
        return res.status(500).json({message : err.message})
    }
}

export const GetAssignmentsByClassController = async (req, res) => {
  const { classId } = req.params;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const studentId = req.user.id;

  const data = await GetAssignmentsByClass(classId, studentId, page, limit);

  return res.json(data);
};

export const GetAssignmentCardsController = async (req, res) => {
  const { assignmentId } = req.params;

  const cards = await GetAssignmentCards(assignmentId);

  return res.json(cards);
};