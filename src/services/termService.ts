import { api, publicApi } from "./api";
import { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";
import { Term } from "../models/termModel";



export const addTerm = async (
  termData: {
    term: string;
    definition: string;
    grammaticalCategory: string;
    theme: string;
  },) => {
  try {
    const response = await api.post("/terms", termData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getAllTerms = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get(`/terms`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getApprovedTerms = async (
  params?: { [key: string]: any }
): Promise<{ terms: Term[]; totalTerms: number } | void> => {
  try {
    const response = await api.get(`/terms/approved`, { params });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getPendingTerms = async () => {
  try {
    const response = await api.get("/terms/pending");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const getQuiz = async (numberOfQuesions:number) => {
  try {
    const response = await api.get("/terms/quiz");
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
}

export const getFlashcardById = async (id: string) => {
  try {
    const response = await api.get(`/terms/${id}/flashcard`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }

}

export const getTermById = async (
  id: string,) => {
  try {
    const response = await publicApi.get(`/terms/${id}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const updateTerm = async (
  id: string,
  termData: {
    term: string;
    definition: string;
    grammaticalCategory: string;
    theme: string;
  },) => {
  try {
    const response = await api.put(`/terms/${id}`, termData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const deleteTerm = async (
  id: string,) => {
  try {
    const response = await api.delete(`/terms/${id}`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const approveTerm = async (
  id: string,
  approveData: {
    grammaticalCategory: string;
    theme: string;
    language: string;
    languageCode: string;
  },) => {
  try {
    const response = await api.post(`/terms/${id}/approve`, approveData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const rejectTerm = async (
  id: string,) => {
  try {
    const response = await api.post(`/terms/${id}/reject`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

// New functions for upvotes, downvotes, comments, and tags

export const upvoteTerm = async (
  id: string,) => {
  try {
    const response = await api.post(`/terms/${id}/upvote`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const downvoteTerm = async (
  id: string,) => {
  try {
    const response = await api.post(`/terms/${id}/downvote`);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const addComment = async (
  termId: string,
  commentData: { text: string; createdAt: Date },) => {
  try {
    const response = await api.post(`/terms/${termId}/comment`, commentData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};

export const addTag = async (
  id: string,
  tagData: { tag: string },) => {
  try {
    const response = await api.post(`/terms/${id}/tag`, tagData);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
  }
};
