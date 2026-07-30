import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().optional().default("5000"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    ALLOWED_ORIGIN_LISTS: z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:");
    console.error(_env.error.format());
    process.exit(1);
}

export const env = _env.data;

// Extend NodeJS ProcessEnv interface
declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> { }
    }
}
