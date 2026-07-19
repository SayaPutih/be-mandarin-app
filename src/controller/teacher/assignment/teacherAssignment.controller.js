import {
  createAssignmentService,
  getAssignmentsByClassService,
  getAssignmentDetailService,
  updateAssignmentService,
  removeAssignmentService,
  getUpdateAssignmentService,
  getAssignmentCardsService,
  getAssignmentStudentsService,
} from "../../../service/teacher/assignment/teacherAssignment.service.js";

export const createAssignmentController = async (req, res) => {
  try {
    const { classId } = req.params;

    const { title, description, dueDate, wordIds } = req.body;

    const assignment = await createAssignmentService({
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

export const getAssignmentsController = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await getAssignmentsByClassService(classId);

    return res.status(200).json(assignments);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentDetailController = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const teacherId = req.user.id;

    const result = await getAssignmentDetailService(assignmentId, teacherId);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const updateAssignmentController = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const { title, description, dueDate, wordIds } = req.body;

    const assignment = await updateAssignmentService({
      assignmentId,
      title,
      description,
      dueDate,
      wordIds,
    });

    return res.status(200).json(assignment);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const removeAssignmentController = async (req, res) => {
  try {
    const { id } = req.body;

    console.log("Controller");

    const result = await removeAssignmentService(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getUpdateAssignmentController = async (req, res) => {
  try {
    const result = await getUpdateAssignmentService(
      req.params.assignmentId,
      req.user.id,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentCardsController = async (req, res) => {
  try {
    const result = await getAssignmentCardsService(
      req.params.assignmentId,
      req.user.id,
      req.query,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentStudentsController = async (req, res) => {
  try {
    const result = await getAssignmentStudentsService(
      req.params.assignmentId,

      req.user.id,

      req.query,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
