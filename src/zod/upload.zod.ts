import { z } from "zod";

export const UploadZod = {
    fileUploadSchema: z.object({
        fieldname: z.string(),
        originalname: z.string().refine(name => name.endsWith('.xlsx') || name.endsWith('.xls'), "Only Excel files are allowed"),
        encoding: z.string(),
        mimetype: z.string().refine(
            mime => mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mime === 'application/vnd.ms-excel',
            "Invalid mime type"
        ),
        size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB")
    })
};

export type UploadedFile = z.infer<typeof UploadZod.fileUploadSchema>;
