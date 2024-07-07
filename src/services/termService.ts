import { api, publicApi } from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

export const addTerm = async (
  termData: {
    term: string;
    definition: string;
    grammaticalCategory: string;
    theme: string;
  },
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post("/terms", termData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getAllTerms = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/terms");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getApprovedTerms = async (navigate: (path: string) => void) => {
  try {
    const response = await publicApi.get("/terms/approved");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getPendingTerms = async (navigate: (path: string) => void) => {
  try {
    const response = await api.get("/terms/pending");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getTermById = async (
  id: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await publicApi.get(`/terms/${id}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const updateTerm = async (
  id: string,
  termData: {
    term: string;
    definition: string;
    grammaticalCategory: string;
    theme: string;
  },
  navigate: (path: string) => void
) => {
  try {
    const response = await api.put(`/terms/${id}`, termData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const deleteTerm = async (
  id: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.delete(`/terms/${id}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const approveTerm = async (
  id: string,
  approveData: {
    grammaticalCategory: string;
    theme: string;
    language: string;
    languageCode: string;
  },
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${id}/approve`, approveData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const rejectTerm = async (
  id: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${id}/reject`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

// New functions for upvotes, downvotes, comments, and tags

export const upvoteTerm = async (
  id: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${id}/upvote`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const downvoteTerm = async (
  id: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${id}/downvote`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const addComment = async (
  termId: string,
  commentData: { text: string; createdAt: Date },
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${termId}/comment`, commentData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const addTag = async (
  id: string,
  tagData: { tag: string },
  navigate: (path: string) => void
) => {
  try {
    const response = await api.post(`/terms/${id}/tag`, tagData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};
