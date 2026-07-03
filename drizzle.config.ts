import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/models/schema/index.ts",
    out: "./src/database/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgres://postgres:sadha123@localhost:5432/stock_management",
    },
});