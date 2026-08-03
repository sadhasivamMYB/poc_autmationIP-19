import { z } from "zod";
import { positiveIntegerSchema } from "./schemas/base.schema";

export const InitialStockZod = {
    createInitialStockSchema: z.object({
        warehouseId: positiveIntegerSchema,
        itemId: positiveIntegerSchema,
        openingCases: z.number().int().min(0).default(0),
        openingBottles: z.number().int().min(0).default(0),
    }),

    updateInitialStockSchema: z.object({
        warehouseId: positiveIntegerSchema.optional(),
        itemId: positiveIntegerSchema.optional(),
        openingCases: z.number().int().min(0).optional(),
        openingBottles: z.number().int().min(0).optional(),
    }),

    stockIdParamSchema: z.object({
        id: positiveIntegerSchema
    })
};

export type CreateInitialStockRequest = z.infer<typeof InitialStockZod.createInitialStockSchema>;
export type UpdateInitialStockRequest = z.infer<typeof InitialStockZod.updateInitialStockSchema>;
