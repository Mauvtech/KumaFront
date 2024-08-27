import {z} from "zod";

export const languageSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
});

export type Language = z.infer<typeof languageSchema>;