import {api} from "../api";
import {PaginatedTerm, PaginatedTermForUser, paginatedTermForUserSchema, paginatedTermSchema} from "./termModel";
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {TermPageAndFilter} from "../../pages/homePage/HomePage";

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

const getApprovedTerms = async (pageParam?: number, pageAndFilter?: TermPageAndFilter): Promise<PaginatedTermForUser | void> => {
    return api.get(`/public/terms?page=${pageParam}&size=${pageAndFilter?.page.size}`,
        {
            params: {
                category: pageAndFilter?.filter?.category,
                tag: pageAndFilter?.filter?.theme,
                language: pageAndFilter?.filter?.language,
                searchTerm: pageAndFilter?.filter?.searchTerm,
                bookmarked: pageAndFilter?.filter?.bookmarked,
            }
        }).then(res => paginatedTermForUserSchema.parse(res.data))
        .catch(err => {
            console.error(err);
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


export const getAuthoredTerms = async (page: number, limit: number): Promise<PaginatedTerm> => {
    return api.get("/terms/authored", {params: {page, limit}}).then(
        res => paginatedTermSchema.parse(res.data)
    );
}

export const getUserApprovedTerms = async (username: string, page: string, limit: string) => {
    const response = await api.get(`/terms/user/${username}/approved`, {params: {page, limit}});
    return response.data;

}

const APPROVED_TERMS_QUERY_KEY = 'approvedTerms';


export function useInfiniteTerms(pageAndFilter: TermPageAndFilter) {
    return useInfiniteQuery({
            queryKey: [APPROVED_TERMS_QUERY_KEY, pageAndFilter],
            queryFn: ({pageParam}) => getApprovedTerms(pageParam, pageAndFilter),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => lastPage!!.number < lastPage!!.totalPages - 1 ? lastPage!!.number + 1 : undefined,
        }
    );
}


export function usePaginatedApprovedTerms(filter: TermPageAndFilter) {
    return useQuery({
        queryKey: [APPROVED_TERMS_QUERY_KEY, filter],
        queryFn: () => getApprovedTerms(filter.page.number, filter),
    });

}
