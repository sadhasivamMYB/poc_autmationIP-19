import { z } from "zod";

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
    return z.object({
        success: z.boolean(),
        message: z.string().optional(),
        data: dataSchema.optional(),
        meta: z.any().optional(),
        errors: z.array(z.any()).optional()
    });
};
