// src/services/languageService.ts
import {api} from "../api";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";
import {languageSchema} from "./languageModel";

export const getAllLanguages = async () => {
    const response = await api.get("/languages");
    return response.data;

};

export const getLanguages = async () => {
    return api.get("/languages").then(
        (response) => {
            return z.array(languageSchema).parse(response.data)
        }).catch(
        (error) => {
            console.log(error)
        }
    )
};

export const addLanguage = async (
    name: string,
    code: string,
) => {
    const response = await api.post("/languages", {name, code});
    return response.data;

};

export const approveLanguage = async (languageId: number, code: string) => {
    const response = await api.post(`/languages/${languageId}/approve`, {code});
    return response.data;
};

export const useLanguages = () => {
    return useQuery({
        queryKey: ['languages'],
        queryFn: getLanguages,
    });
}
