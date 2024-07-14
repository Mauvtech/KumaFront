// src/services/statsService.ts
import api from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getStats = async () => {
  try {
    const response = await api.get("/stats");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};
