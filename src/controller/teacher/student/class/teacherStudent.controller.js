import {
  addStudentToClassService,
  getAvailableStudentsService,
  removeStudentFromClassService,
  getWordsService,
  getStudentsByClassService,
} from "../../../../service/teacher/student/class/teacherStudent.service.js";

export const getStudentsByClassController = async (req, res) => {
  try {
    const { classId } = req.params;
    console.log("HIT STUDENTS ALL")
    const students = await getStudentsByClassService(classId);

    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addStudentController = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;

    const enrollment = await addStudentToClassService({
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

export const getAvailableStudentsController = async (req, res) => {
  try {
    const { classId } = req.params;

    const { search } = req.query;

    const students = await getAvailableStudentsService({
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

    await removeStudentFromClassService({
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

    const result = await getWordsService({
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








