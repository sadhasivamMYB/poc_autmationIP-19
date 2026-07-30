import { z } from "zod";
import { nonStringEmptySchema, positiveIntegerSchema, booleanSchema } from "./schemas/base.schema";

export const MasterZod = {
    createItemSchema: z.object({
        itemCode: nonStringEmptySchema.max(50),
        itemName: nonStringEmptySchema.max(255),
        bottlePerCase: positiveIntegerSchema,
        isActive: booleanSchema.optional().default(true),
    }),

    updateItemSchema: z.object({
        itemCode: nonStringEmptySchema.max(50).optional(),
        itemName: nonStringEmptySchema.max(255).optional(),
        bottlePerCase: positiveIntegerSchema.optional(),
        isActive: booleanSchema.optional(),
    }),
    
    itemIdParamSchema: z.object({
        id: positiveIntegerSchema
    })
};

export type CreateMasterItemRequest = z.infer<typeof MasterZod.createItemSchema>;
export type UpdateMasterItemRequest = z.infer<typeof MasterZod.updateItemSchema>;
