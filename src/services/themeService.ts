import {api,publicApi} from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getThemes = async (navigate :(path:string) => void) => {
 try{const response = await publicApi.get("/themes/approved");
  return response.data;} catch(error){
    handleAuthError(error as AxiosError<ErrorResponse>,navigate)
  }
};

export const getAllThemes = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/themes");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};


export const addTheme = async (
  theme: string,
  navigate: (path: string) => void
) => {
  const response = await api.post("/themes", { theme });
  return response.data;
};

export const approveTheme = async (themeId: string) => {
  return await api.post(`/themes/${themeId}/approve`);
};