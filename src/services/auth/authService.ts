import api from "../api";
import {jwtDecode} from "jwt-decode";
import {AuthenticatedUser, Role} from "./userModel";


interface DecodedToken {
    id: number;
    username: string;
    role: string;
    exp: number;
}

export const register = (userData: {
    username: string;
    password: string;
}) => {
    return api.post("/auth/register", userData);
};

export const login = (userData: {
    username: string;
    password: string
}) => {
    return api.post("/auth/login", userData).then((response) => {
        if (response.data.token) {
            const token = response.data.token;
            const decodedToken = jwtDecode<DecodedToken>(token);
            const {id, username, role} = decodedToken;
            const user = {token, id, username, role: role as Role} satisfies AuthenticatedUser;
            localStorage.setItem("user", JSON.stringify(user));
            return user; // Retourner l'objet utilisateur complet
        }
        return null;
    });
};

export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

export const isTokenExpired = (token: string): boolean => {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};
