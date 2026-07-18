import {
  teacherVocabularyService,
  teacherCreateVocabularyService,
  teacherUpdateVocabularyService,
  teacherDeleteVocabularyService,
} from "../../service/teacher/teacherWord.service.js";

export const teacherVocabularyController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await teacherVocabularyService(page, limit);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherVocabularyDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await teacherVocabularyDetailService(id);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherCreateVocabularyController = async (req, res) => {
  try {
    const result = await teacherCreateVocabularyService(req.body);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherUpdateVocabularyController = async (req, res) => {
  try {
    const result = await teacherUpdateVocabularyService(
      req.params.id,
      req.body,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const teacherDeleteVocabularyController = async (req, res) => {
  try {
    await teacherDeleteVocabularyService(req.params.id);

    return res.status(200).json({
      message: "Vocabulary deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};