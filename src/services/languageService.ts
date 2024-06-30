// src/services/languageService.ts
import {publicApi, api} from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getAllLanguages = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/languages");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getLanguages = async (navigate: (path:string) => void) => {
  try{
    const response = await publicApi.get("/languages/approved");
    return response.data
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate)
  }
}

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

export const approveLanguage = async (languageId: string) => {
  return await api.post(`/languages/${languageId}/approve`);
};
