import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const register = (userData: {
  username: string;
  password: string;
  role: string;
}) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const login = (userData: { username: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login`, userData).then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
