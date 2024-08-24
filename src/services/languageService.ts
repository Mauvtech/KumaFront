// src/services/languageService.ts
import {  api } from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getAllLanguages = async () => {
  try {
    const response = await api.get("/languages");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getLanguages = async () => {
  try {
    const response = await api.get("/languages/approved");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const addLanguage = async (
  name: string,
  code: string,
) => {
  try {
    const response = await api.post("/languages", { name, code });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const approveLanguage = async (languageId: string, code: string) => {
  const response = await api.post(`/languages/${languageId}/approve`, { code });
  return response.data;
};
