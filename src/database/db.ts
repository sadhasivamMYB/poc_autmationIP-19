import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as index from "../models/schema/index";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:sadha123@localhost:5432/stock_management";
const client = postgres(connectionString);

export const db = drizzle(client, { schema: index });