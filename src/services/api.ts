import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { isTokenExpired, logout } from "./authService";
import { ErrorResponse } from "../utils/types";


const apiBaseURL = process.env.REACT_APP_PROD_API_URL;

if (!apiBaseURL) {
  throw new Error("API base URL not defined in environment variables");
}


export const api = axios.create({
  baseURL: apiBaseURL,
});

export const publicApi = axios.create({
  baseURL: apiBaseURL,
});

const handleError = (error: AxiosError<ErrorResponse>, navigate: Function) => {
  if (error.response && error.response.status === 401) {
    logout();
    navigate("/login");
  }
  return Promise.reject(error);
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (isTokenExpired(user.token)) {
        logout();
        window.location.href = "/login";
      } else {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set("Authorization", `Bearer ${user.token}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    return handleError(error, (path: string) => {
      window.location.href = path;
    });
  }
);

export default api;
