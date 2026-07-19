import {
  teacherClassCreateService,
  teacherClassGetService,
  deleteClassService,
} from "../../../service/teacher/class/teacherClass.service.js";

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

export const teacherDeleteClassController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteClassService(id);

    return res.status(200).json({
      message: "Class deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

