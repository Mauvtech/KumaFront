import {api} from "../api";
import {useQuery} from "@tanstack/react-query";
import {tagSchema} from "./tagModel";
import {z} from "zod";

export const getTags = async () => {
    const response = await api.get("/tags");
    return z.array(tagSchema).parse(response.data)

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