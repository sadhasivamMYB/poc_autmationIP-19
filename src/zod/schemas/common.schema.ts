import { z } from "zod";
import { positiveIntegerSchema } from "./base.schema";

export const paginationQuerySchema = z.object({
    page: positiveIntegerSchema.optional().default(1),
    limit: positiveIntegerSchema.optional().default(10),
    sort: z.string().trim().optional(),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    search: z.string().trim().optional(),
});
