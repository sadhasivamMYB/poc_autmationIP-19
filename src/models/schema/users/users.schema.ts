import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

import { warehouses } from "../warehouse/warehouse.schema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),

    fullName: varchar("full_name", { length: 150 }).notNull(),

    email: varchar("email", { length: 255 })
        .unique()
        .notNull(),

    password: varchar("password", { length: 255 }).notNull(),

    role: varchar("role", { length: 30 }).notNull(),

    warehouseId: integer("warehouse_id").references(
        () => warehouses.id
    ),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});