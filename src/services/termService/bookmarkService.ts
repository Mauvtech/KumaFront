import {handleAuthError} from "../../utils/handleAuthError";
import {AxiosError} from "axios";
import {ErrorResponse} from "../../utils/types";
import api from "../api";

export const getBookmarks = async (page: string, limit: string) => {
    try {
        const response = await api.get("/terms/bookmarks", {params: {page, limit}});
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};

export const bookmarkTerm = async (id: string) => {
    try {
        const response = await api.post(`/terms/${id}/bookmark`);
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};

export const unbookmarkTerm = async (id: string) => {
    try {
        const response = await api.post(`/terms/${id}/unbookmark`);
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
}
