// src/services/userService.ts
import api from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const updateUserProfile = async (
  userData: { username?: string; password?: string },
  
) => {
  try {
    const response = await api.put("/users/me", userData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const banUser = async (
  userId: string,
  
) => {
  try {
    const response = await api.post(`/users/${userId}/ban`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const promoteUser = async (
  userId: string,
  
) => {
  try {
    const response = await api.post(`/users/promote/admin/${userId}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};
