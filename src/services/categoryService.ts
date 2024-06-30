// src/services/categoryService.ts
import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const addCategory = async (category: string) => {
  const response = await api.post("/categories", { category });
  return response.data;
};
