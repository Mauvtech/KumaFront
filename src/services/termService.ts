import axios, { AxiosError } from "axios";
import { handleAuthError } from "../utils/handleAuthError";
import { ErrorResponse } from "../utils/types";

const API_URL = "http://localhost:3001/api/terms";

export const addTerm = async (
  termData: {
    term: string;
    definition: string;
    grammaticalCategory: string;
    themes: string[];
  },
  token: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await axios.post(API_URL, termData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getAllTerms = async (
  token: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const getTermById = async (
  id: string,
  token: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    themes: string[];
  },
  token: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, termData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const deleteTerm = async (
  id: string,
  token: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const approveTerm = async (
  id: string,
  token: string,
  navigate: (path: string) => void
) => {
  try {
    console.log("id", id);
    console.log("token", token);
    const response = await axios.post(
      `${API_URL}/${id}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};

export const rejectTerm = async (
  id: string,
  token: string,
  navigate: (path: string) => void
) => {
  try {
        console.log("id", id);
        console.log("token", token);
    const response = await axios.post(
      `${API_URL}/${id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>, navigate);
  }
};
