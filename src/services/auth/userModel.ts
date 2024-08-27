import {z} from "zod";

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
});

const roleSchema = z.enum(["admin", "user", "moderator"]);

export type Role = z.infer<typeof roleSchema>;
export const authenticatedUserSchema = userSchema.extend({
    role: roleSchema,
    token: z.string(),
});


export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;


export type User = z.infer<typeof userSchema>;


