import { z } from "zod";
import { positiveIntegerSchema, nonStringEmptySchema } from "./schemas/base.schema";

const compareItemBase = {
    warehouseId: positiveIntegerSchema.optional().nullable(),
    warehouseCode: z.string().optional().nullable(),
    itemCode: z.string().optional().nullable(),
    itemName: z.string().optional().nullable(),
    physicalStock: z.union([z.string(), z.number()]).optional().nullable(),
    systemStock: z.union([z.string(), z.number()]).optional().nullable(),
    difference: z.union([z.string(), z.number()]).optional().nullable(),
    manual: z.union([z.string(), z.number()]).optional().nullable(),
    salesReturn: z.union([z.string(), z.number()]).optional().nullable(),
    blocked: z.union([z.string(), z.number()]).optional().nullable(),
    stoPending: z.union([z.string(), z.number()]).optional().nullable(),
    grnPending: z.union([z.string(), z.number()]).optional().nullable(),
    damages: z.union([z.string(), z.number()]).optional().nullable(),
    pendingSupply: z.union([z.string(), z.number()]).optional().nullable(),
};

export const CompareZod = {
    bulkSaveSchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
        data: z.array(z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
            ...compareItemBase
        }))
    }),

    updateBulkSchema: z.object({
        data: z.array(z.object({
            id: positiveIntegerSchema,
            ...compareItemBase
        }))
    }),

    getByDateQuerySchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    })
};

export type BulkSaveRequest = z.infer<typeof CompareZod.bulkSaveSchema>;
export type UpdateBulkRequest = z.infer<typeof CompareZod.updateBulkSchema>;
