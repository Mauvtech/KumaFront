// src/services/userService.ts
import api from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getUserProfile = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getUsers = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const banUser = async (
  userId: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/users/${userId}/ban`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const promoteUser = async (
  userId: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/users/promote/admin/${userId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};
