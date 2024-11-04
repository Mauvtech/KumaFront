import api from "../api";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Term, TermForUser, termForUserSchema} from "./termModel";
import {AxiosResponse} from "axios";


type TermUpdateRequest = {
    term?: string;
    definition?: string;
    grammaticalCategory?: string;
    theme?: string;
    upvote?: boolean;
    bookmark?: boolean;
}

type TermUpdateRequestWithId = {
    id: number;
    request: TermUpdateRequest;
}


const updateTerm = async (
    id: number,
    termData: TermUpdateRequest): Promise<Term> => {

    return api.put(`/terms/${id}`, termData).then(
        (response: AxiosResponse<Term>) => response.data
    )
};

const TERM_QUERY_KEY = 'terms';

export default function useTerms() {

    const queryClient = useQueryClient();
    const useSaveMutation = () => {
        return useMutation({
            mutationFn: (req: TermUpdateRequestWithId) => updateTerm(req.id, req.request),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: [TERM_QUERY_KEY]});
            },
        })
    };

    const addBookmark = useMutation({
        mutationFn: (req: TermUpdateRequestWithId) => updateTerm(req.id, req.request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [TERM_QUERY_KEY]});
        },
    })

    const getById = async (id: string) => {
        return api.get(`/public/terms/${id}`).then(
            (response: AxiosResponse<TermForUser>) => termForUserSchema.parse(response.data))
    }

    return {
        saveMutation: useSaveMutation,
        getById
    };
}