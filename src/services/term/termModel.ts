import {categorySchema} from "../category/categoryModel";
import {userSchema} from "../auth/userModel";
import {z} from "zod";
import {tagSchema} from "../tag/tagModel";
import createPaginatedResponseSchema from "../../utils/pagination/ZodPagination";


const commentSchema = z.object({
    author: userSchema,
    text: z.string(),
    createdAt: z.string().transform((value) => new Date(value)),
})

type Comment = z.infer<typeof commentSchema>

const languageSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
})

export const termSchema = z.object({
    id: z.number(),
    name: z.string(),
    language: languageSchema,
    definition: z.string(),
    translation: z.string(),
    grammaticalCategory: categorySchema,
    tags: z.array(tagSchema),
    author: userSchema,
    voteCount: z.number(),
})

export const termForUserSchema = z.object({
    term: termSchema,
    userVote: z.boolean().nullable(),
    userHasBookmarked: z.boolean(),
})

export type TermForUser = z.infer<typeof termForUserSchema>

export const paginatedTermForUserSchema = createPaginatedResponseSchema(termForUserSchema);
export const paginatedTermSchema = createPaginatedResponseSchema(termSchema);
export type PaginatedTerm = z.infer<typeof paginatedTermSchema>;


export type Term = z.infer<typeof termSchema>;

export type PaginatedTermForUser = z.infer<typeof paginatedTermForUserSchema>;
