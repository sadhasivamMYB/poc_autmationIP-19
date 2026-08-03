import { z } from "zod";
import { positiveIntegerSchema, nonStringEmptySchema } from "./schemas/base.schema";

const baseDailyStock = {
    warehouseId: positiveIntegerSchema,
    itemId: positiveIntegerSchema,
    stockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    openingCases: z.number().int().min(0).optional().default(0),
    openingBottles: z.number().int().min(0).optional().default(0),
    receivedCases: z.number().int().min(0).optional().default(0),
    receivedBottles: z.number().int().min(0).optional().default(0),
    issuedCases: z.number().int().min(0).optional().default(0),
    issuedBottles: z.number().int().min(0).optional().default(0),
    closingCases: z.number().int().min(0).optional().default(0),
    closingBottles: z.number().int().min(0).optional().default(0),
    status: nonStringEmptySchema.max(20).optional().default("OPEN"),
};

export const DailyStockZod = {
    createDailyStockSchema: z.object(baseDailyStock),

    updateDailyStockSchema: z.object(baseDailyStock).partial(),

    bulkUpdateSchema: z.object({
        stocks: z.array(z.object({
            id: positiveIntegerSchema,
            ...baseDailyStock
        }).partial())
    }),

    historyQuerySchema: z.object({
        warehouseId: positiveIntegerSchema,
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    }),

    stockIdParamSchema: z.object({
        id: positiveIntegerSchema
    })
};

export type CreateDailyStockRequest = z.infer<typeof DailyStockZod.createDailyStockSchema>;
export type UpdateDailyStockRequest = z.infer<typeof DailyStockZod.updateDailyStockSchema>;
export type BulkUpdateDailyStockRequest = z.infer<typeof DailyStockZod.bulkUpdateSchema>;
export type HistoryQueryRequest = z.infer<typeof DailyStockZod.historyQuerySchema>;
