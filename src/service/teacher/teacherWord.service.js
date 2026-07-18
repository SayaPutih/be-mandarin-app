import {
  getVocabulary,
  getVocabularyById,
  getVocabularyBySimplified,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} from "../../repositories/teacher/teacherWord.repository.js";

export const teacherVocabularyService = async (page, limit) => {
  return await getVocabulary(page, limit);
};

export const teacherVocabularyDetailService = async (id) => {
  return await getVocabularyById(id);
};

export const teacherCreateVocabularyService = async (data) => {
  const existing = await getVocabularyBySimplified(data.simplified);

  if (existing) {
    throw new Error("Vocabulary already exists");
  }

  return await createVocabulary(data);
};

export const teacherUpdateVocabularyService = async (id, data) => {
  return await updateVocabulary(id, data);
};

export const teacherDeleteVocabularyService = async (id) => {
  return await deleteVocabulary(id);
};