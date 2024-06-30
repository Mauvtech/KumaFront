import axios from "axios";
import { isTokenExpired, logout } from "./authService";


export const api = axios.create({
  baseURL: process.env.REACT_APP_PROD_API_URL,
});

export const publicApi = axios.create({
  baseURL: process.env.REACT_APP_PROD_API_URL,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (isTokenExpired(user.token)) {
        logout();
        window.location.href = "/login"; // Redirection vers la page de login
      } else {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = "/login"; // Redirection vers la page de login
    }
    return Promise.reject(error);
  }
);

export default api;
