import {
  getVocabularyRepository,
  getVocabularyByIdRepository,
  getVocabularyBySimplifiedRepository,
  createVocabularyRepository,
  updateVocabularyRepository,
  deleteVocabularyRepository,
} from "../../../repositories/teacher/vocabulary/teacherVocabulary.repository.js";

export const teacherVocabularyService = async (page, limit) => {
  return await getVocabularyRepository(page, limit);
};

export const teacherVocabularyDetailService = async (id) => {
  return await getVocabularyByIdRepository(id);
};

export const teacherCreateVocabularyService = async (data) => {
  const existing = await getVocabularyBySimplifiedRepository(data.simplified);

  if (existing) {
    throw new Error("Vocabulary already exists");
  }

  return await createVocabularyRepository(data);
};

export const teacherUpdateVocabularyService = async (id, data) => {
  return await updateVocabularyRepository(id, data);
};

export const teacherDeleteVocabularyService = async (id) => {
  return await deleteVocabularyRepository(id);
};