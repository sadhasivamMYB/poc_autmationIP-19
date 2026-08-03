import { z } from "zod";
import { positiveIntegerSchema } from "./schemas/base.schema";

export const SummaryZod = {
    getSummaryQuerySchema: z.object({
        warehouseId: positiveIntegerSchema,
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    })
};

export type GetSummaryQuery = z.infer<typeof SummaryZod.getSummaryQuerySchema>;
