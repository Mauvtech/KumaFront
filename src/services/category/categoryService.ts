// src/services/categoryService.ts
import {api} from "../api";
import {Category, categorySchema} from "./categoryModel";
import {AxiosResponse} from "axios";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";


export const getAllCategories = async () => {
    api.get("/categories").then(
        (response: AxiosResponse<Category>) => {
            return categorySchema.parse(response.data);
        }
    )
};

export const getCategories = async () => {
    const response = await api.get("/public/categories");
    return z.array(categorySchema).parse(response.data)
};

export const addCategory = async (category: string) => {
    const response = await api.post("/categories", {category});
    return response.data;
};

export const approveCategory = async (categoryId: number) => {
    return await api.post(`/categories/${categoryId}/approve`);
};

const CATEGORY_QUERY_KEY = 'categories';

export function useCategories() {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEY],
        queryFn: getCategories,
    })
}