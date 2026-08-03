import { z } from "zod";
import { nonStringEmptySchema, positiveIntegerSchema, booleanSchema } from "./schemas/base.schema";

export const WarehouseZod = {
    createWarehouseSchema: z.object({
        warehouseName: nonStringEmptySchema.max(100),
        warehouseCode: nonStringEmptySchema.max(50).optional(),
        isActive: booleanSchema.optional().default(true),
    }),

    updateWarehouseSchema: z.object({
        warehouseName: nonStringEmptySchema.max(100).optional(),
        warehouseCode: nonStringEmptySchema.max(50).optional(),
        isActive: booleanSchema.optional(),
    }),

    warehouseIdParamSchema: z.object({
        id: positiveIntegerSchema
    })
};

export type CreateWarehouseRequest = z.infer<typeof WarehouseZod.createWarehouseSchema>;
export type UpdateWarehouseRequest = z.infer<typeof WarehouseZod.updateWarehouseSchema>;
