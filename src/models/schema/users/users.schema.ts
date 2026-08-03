import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

import { warehouses } from "../warehouse/warehouse.schema";

import { UserStatus } from "../../enums/userStatus.enum";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),

    fullName: varchar("full_name", { length: 150 }).notNull(),

    email: varchar("email", { length: 255 })
        .unique()
        .notNull(),

    password: varchar("password", { length: 255 }),

    role: varchar("role", { length: 30 }).notNull(),

    status: varchar("status", { length: 20 }).default(UserStatus.ACTIVE).notNull(),

    warehouseId: integer("warehouse_id").references(
        () => warehouses.id
    ),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});