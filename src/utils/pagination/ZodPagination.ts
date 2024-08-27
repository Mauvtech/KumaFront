import {z} from "zod";

export default function createPaginatedResponseSchema<
    ItemType extends z.ZodTypeAny,
>(itemSchema: ItemType) {
    return z.object({
        number: z.number(),
        size: z.number(),
        totalElements: z.number(),
        totalPages: z.number(),
        content: z.array(itemSchema),
    });
}
