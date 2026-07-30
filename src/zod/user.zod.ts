import { z } from "zod";
import { emailSchema, passwordSchema, nonStringEmptySchema, positiveIntegerSchema } from "./schemas/base.schema";

export const UserZod = {
    createUserSchema: z.object({
        fullName: nonStringEmptySchema.max(150),
        email: emailSchema.max(255),
        password: passwordSchema.max(255),
        role: nonStringEmptySchema.max(30),
        warehouseId: z.number().int().positive().optional(),
    }),

    updateUserSchema: z.object({
        fullName: nonStringEmptySchema.max(150).optional(),
        email: emailSchema.max(255).optional(),
        password: passwordSchema.max(255).optional(),
        role: nonStringEmptySchema.max(30).optional(),
        warehouseId: z.number().int().positive().optional().nullable(),
    }),

    userIdParamSchema: z.object({
        id: positiveIntegerSchema
    })
};

export type CreateUserRequest = z.infer<typeof UserZod.createUserSchema>;
export type UpdateUserRequest = z.infer<typeof UserZod.updateUserSchema>;
