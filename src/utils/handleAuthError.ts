import { AxiosError } from "axios";
import { ErrorResponse } from "./types";

export const handleAuthError = (
  error: AxiosError<ErrorResponse>,
  navigate: (path: string) => void
) => {
  if (error.response?.status === 401) {
    // Rediriger vers la page de connexion si le token a expiré
    navigate("/login");
  } else if (error.response?.status === 403) {
    alert("Access denied: You do not have the right permissions");
  } else {
    const errorMessage = error.response?.data?.message || error.message;
    console.log(`Error: ${errorMessage}`)
  }
};
