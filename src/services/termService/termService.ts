import {api} from "../api";
import {AxiosError} from "axios";
import {handleAuthError} from "../../utils/handleAuthError";
import {ErrorResponse} from "../../utils/types";
import {Term} from "../../models/termModel";
import {useQuery} from '@tanstack/react-query';

export const addTerm = async (
    termData: {
        term: string;
        definition: string;
        grammaticalCategory: string;
        theme: string;
    }) => {
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
            params: {page, limit},
        });
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};

export const getApprovedTerms = async (
    params?: {
        [key: string]: any
    }
): Promise<{
    terms: Term[];
    totalTerms: number;
    totalPages: number
}> => {
    const response = await api.get(`/terms/approved`, {params});
    return response.data;
};

export const getPendingTerms = async () => {
    try {
        const response = await api.get("/terms/pending");
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};


export const getTermById = async (
    id: string,) => {
    try {
        const response = await api.get(`/terms/${id}`);
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

type ApproveTermRequest = {
    grammaticalCategory: string;
    theme: string;
    language: string;
    languageCode: string;
}

export const approveTerm = async (
    id: string,
    approveData: ApproveTermRequest): Promise<any> => {
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
    commentData: {
        text: string;
        createdAt: Date
    },) => {
    try {
        const response = await api.post(`/terms/${termId}/comment`, commentData);
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
};

export const getVotes = async (termId: string) => {
    try {
        const response = await api.get(`/terms/${termId}/votes`);
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
}


export const getAuthoredTerms = async (page: string, limit: string) => {
    try {
        const response = await api.get("/terms/authored", {params: {page, limit}});
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
}

export const getUserApprovedTerms = async (username: string, page: string, limit: string) => {
    try {
        const response = await api.get(`/terms/user/${username}/approved`, {params: {page, limit}});
        return response.data;
    } catch (error) {
        handleAuthError(error as AxiosError<ErrorResponse>);
    }
}

const APPROVED_TERMS_QUERY_KEY = 'approvedTerms';

type filteredAndPaginatedTerms = {
    category?: string;
    theme?: string,
    language?: string,
    searchTerm?: string,
    page: number,
    limit: number,
}


export function usePaginatedApprovedTerms(pageAndFilter: filteredAndPaginatedTerms) {
    return useQuery({
        queryKey: [APPROVED_TERMS_QUERY_KEY, pageAndFilter],
        queryFn: () => getApprovedTerms(pageAndFilter),
    });

}

