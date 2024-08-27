import {z} from "zod";

export const languageSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    isApproved: z.boolean(),
});

export type Language = z.infer<typeof languageSchema>;