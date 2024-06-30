// src/services/languageService.ts
import api from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getLanguages = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/languages/all");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const addLanguage = async (
  name: string,
  code: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post("/languages", { name, code });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};
