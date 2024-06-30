// src/services/themeService.ts
import api from "./api";
import { isTokenExpired } from "./authService";

export const getThemes = async () => {
  const response = await api.get("/themes");
  return response.data;
};

export const addTheme = async (
  theme: string,
  navigate: (path: string) => void
) => {
  const response = await api.post("/themes", { theme });
  return response.data;
};
