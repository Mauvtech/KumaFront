import {api} from "../api";
import {PaginatedTerm, paginatedTermForUserSchema} from "./termModel";
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {Page, TermFilter} from "../../pages/homePage/HomePage";

export const addTerm = async (
    termData: {
        term: string;
        definition: string;
        grammaticalCategory: string;
        theme: string;
    }) => {
    const response = await api.post("/terms", termData);
    return response.data;

};

export const getAllTerms = async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/terms`, {
        params: {page, limit},
    });
    return response.data;

};

const getApprovedTerms = async (pageParam?: number, filter?: TermFilter): Promise<PaginatedTerm | void> => {

    console.log(pageParam)
    return api.get(`/terms?page=${pageParam}&size=4`,
        {
            params: {
                category: filter?.category,
                theme: filter?.theme,
                language: filter?.language,
                searchTerm: filter?.searchTerm
            }
        }).then(res => paginatedTermForUserSchema.parse(res.data)
    ).catch((error) => {
        console.log(error)
    })
};

export const getPendingTerms = async () => {
    const response = await api.get("/terms/pending");
    return response.data;

};


export const getTermById = async (
    id: string,) => {
    const response = await api.get(`/terms/${id}`);
    return response.data;

};


type ApproveTermRequest = {
    grammaticalCategory: string;
    theme: string;
    language: string;
    languageCode: string;
}

export const approveTerm = async (
    id: number,
    approveData: ApproveTermRequest): Promise<any> => {
    const response = await api.post(`/terms/${id}/approve`, approveData);
    return response.data;

};

export const rejectTerm = async (
    id: string,) => {
    const response = await api.post(`/terms/${id}/reject`);
    return response.data;

};


export const upvoteTerm = async (
    id: string,) => {
    const response = await api.post(`/terms/${id}/upvote`);
    return response.data;

};


export const downvoteTerm = async (
    id: string,) => {
    const response = await api.post(`/terms/${id}/downvote`);
    return response.data;

};

export const addComment = async (
    termId: string,
    commentData: {
        text: string;
        createdAt: Date
    },) => {
    const response = await api.post(`/terms/${termId}/comment`, commentData);
    return response.data;

};

export const getVotes = async (termId: string) => {
    const response = await api.get(`/terms/${termId}/votes`);
    return response.data;

}


export const getAuthoredTerms = async (page: string, limit: string) => {
    const response = await api.get("/terms/authored", {params: {page, limit}});
    return response.data;
}

export const getUserApprovedTerms = async (username: string, page: string, limit: string) => {
    const response = await api.get(`/terms/user/${username}/approved`, {params: {page, limit}});
    return response.data;

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


export function useInfiniteTerms(filter: TermFilter) {
    return useInfiniteQuery({
            queryKey: [APPROVED_TERMS_QUERY_KEY],
            queryFn: ({pageParam}) => getApprovedTerms(pageParam, filter),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => lastPage!!.number < lastPage!!.totalPages - 1 ? lastPage!!.number + 1 : undefined,
        }
    );
}


export function usePaginatedApprovedTerms(page: Page) {
    return useQuery({
        queryKey: [APPROVED_TERMS_QUERY_KEY, page],
        queryFn: () => getApprovedTerms(page.number),
    });

}