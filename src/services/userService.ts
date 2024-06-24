import axios from "axios";

const API_URL = "http://localhost:3001/users";

export const getUserProfile = (token: string) => {
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
