// src/services/userService.ts
import api from "./api";

export const getUserProfile = async () => {
    const response = await api.get("/users/me");
    return response.data;

};

export const getUsers = async (page: number = 1, limit: number = 10) => {
    const response = await api.get("/users", {
        params: {
            page,
            limit,
        },
    });
    return response.data;

};

export const updateUserProfile = async (
    userData: { username?: string; password?: string },
) => {
    const response = await api.put("/users/me", userData);
    return response.data;
};


export const banUser = async (
    userId: string,
) => {
    const response = await api.post(`/users/${userId}/ban`);
    return response.data;

};

export const promoteUser = async (
    userId: string,
) => {
    const response = await api.post(`/users/promote/admin/${userId}`);
    return response.data;

};
