import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");
export const emailSchema = z.string().email("Invalid email address").trim().toLowerCase();
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
export const positiveDecimalSchema = z.preprocess((val) => Number(val), z.number().positive("Value must be positive"));
export const positiveIntegerSchema = z.preprocess((val) => Number(val), z.number().int().positive("Value must be a positive integer"));
export const booleanSchema = z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
}, z.boolean());
export const dateStringSchema = z.string().datetime({ message: "Invalid ISO date string" });
export const nonStringEmptySchema = z.string().trim().min(1, "Field cannot be empty");
export const optionalStringSchema = z.string().trim().optional();
export const nullableStringSchema = z.string().trim().nullable();
