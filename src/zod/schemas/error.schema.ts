import { z } from "zod";

export const errorDetailSchema = z.object({
    field: z.string().optional(),
    message: z.string()
});

export const errorResponseSchema = z.object({
    success: z.literal(false),
    message: z.string(),
    errors: z.array(errorDetailSchema).optional(),
});
