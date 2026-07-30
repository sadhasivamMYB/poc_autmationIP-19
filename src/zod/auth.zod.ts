import { z } from "zod";
import { emailSchema, passwordSchema, nonStringEmptySchema } from "./schemas/base.schema";

export const AuthZod = {
    registerSchema: z.object({
        fullName: nonStringEmptySchema.max(150, "Full name cannot exceed 150 characters"),
        email: emailSchema.max(255),
        password: passwordSchema.max(255),
        role: nonStringEmptySchema.max(30),
        warehouseId: z.number().int().positive().optional(),
    }),

    loginSchema: z.object({
        email: emailSchema,
        password: z.string().min(1, "Password is required"),
    }),

    microsoftLoginSchema: z.object({
        token: z.string().min(1, "Microsoft token is required"),
    })
};

export type RegisterRequest = z.infer<typeof AuthZod.registerSchema>;
export type LoginRequest = z.infer<typeof AuthZod.loginSchema>;
export type MicrosoftLoginRequest = z.infer<typeof AuthZod.microsoftLoginSchema>;
