import {
  teacherClassCreateService,
  teacherClassGetService,
  getStudentsByClass,
  addStudentToClass,
  getAssignmentsByClass,
  createAssignment,
  getAvailableStudents,
  removeStudentFromClass,
  getWords,
  getAssignmentDetailService,
  getAssignmentCardsService,
  getAssignmentStudentsService,
  removeAssignmentService,
} from "../../service/teacher/teacherClass.service.js";

export const teacherClassCreateController = async (req, res) => {
  try {
    const { name, description } = req.body;
    const teacherId = req.user.id;
    const result = await teacherClassCreateService(
      name,
      description,
      teacherId,
    );

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      on: "Create Class Error",
    });
  }
};

export const teacherClassGetAllController = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await teacherClassGetService(teacherId, page, limit);

    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      on: "Get Class Error",
    });
  }
};

export const getStudentsByClassController = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await getStudentsByClass(classId);

    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addStudentController = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;

    const enrollment = await addStudentToClass({
      classId,
      studentIds,
    });

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({
        message: "No students selected",
      });
    }

    return res.status(201).json(enrollment);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentsController = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await getAssignmentsByClass(classId);

    return res.status(200).json(assignments);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const createAssignmentController = async (req, res) => {
  try {
    const { classId } = req.params;

    const { title, description, dueDate, wordIds } = req.body;

    const assignment = await createAssignment({
      classId,
      title,
      description,
      dueDate,
      wordIds,
    });

    return res.status(201).json(assignment);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAvailableStudentsController = async (req, res) => {
  try {
    const { classId } = req.params;

    const { search } = req.query;

    const students = await getAvailableStudents({
      classId,
      search,
    });

    return res.status(200).json({
      result: students,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const removeStudentController = async (req, res) => {
  try {
    const { classId } = req.params;

    const { studentId } = req.body;

    await removeStudentFromClass({
      classId,
      studentId,
    });

    return res.status(200).json({
      message: "Student removed successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getWordsController = async (req, res) => {
  try {
    const {
      hanzi,
      pinyin,
      meaning,
      hskLevel,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getWords({
      hanzi,
      pinyin,
      meaning,
      hskLevel,
      page,
      limit,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentDetail = async (req,res) => {
  try{

    const assignmentId = req.params.assignmentId;
    const teacherId = req.user.id;

    const result = await getAssignmentDetailService(assignmentId, teacherId);

    return res.status(200).json(result);

  }catch(err){
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentCardsController = async (req, res) => {
  try{
    const result = await getAssignmentCardsService(
      req.params.assignmentId,
      req.user.id,
      req.query,
    );

    return res.status(200).json(result);

  }catch(err){
    return res.status(500).json({
      message: err.message,
    });
  }
};


export const getAssignmentStudentsController = async (req, res) => {
  try{

    const result = await getAssignmentStudentsService(
      req.params.assignmentId,

      req.user.id,

      req.query,
    );

    return res.status(200).json(result);
  }catch(err){
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const removeAssignmentController = async (req,res)=>{
  try {

    const { id } = req.body;

    console.log("Controller")

    const result = await removeAssignmentService(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}
