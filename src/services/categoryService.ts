// src/services/categoryService.ts
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import {api, publicApi} from "./api";
import { ErrorResponse } from "../utils/types";

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getCategories = async () => {
  try {
    const response = await publicApi.get("/categories/approved");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const addCategory = async (category: string) => {
  const response = await api.post("/categories", { category });
  return response.data;
};

export const approveCategory = async (categoryId: string) => {
  return await api.post(`/categories/${categoryId}/approve`);
};

