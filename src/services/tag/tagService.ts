import {api} from "../api";
import {useQuery} from "@tanstack/react-query";
import {tagSchema} from "./tagModel";
import {z} from "zod";


export const getTags = async () => {
    return api.get("/tags").then(
        (response) => {
            return z.array(tagSchema).parse(response.data)
        }).catch(
        (error) => {
            console.log(error)
        }
    )
};


export const addTheme = async (
    theme: string,
) => {
    const response = await api.post("/themes", {theme});
    return response.data;
};

export const approveTheme = async (themeId: number) => {
    return await api.post(`/themes/${themeId}/approve`);
};
const THEME_QUERY_KEY = 'themes';

export function useTags() {
    return useQuery({
        queryKey: [THEME_QUERY_KEY],
        queryFn: getTags,
    })
}