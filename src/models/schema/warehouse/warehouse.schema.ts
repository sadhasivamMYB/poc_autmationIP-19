import {
    pgTable,
    serial,
    varchar,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const warehouses = pgTable("warehouses", {
    id: serial("id").primaryKey(),

    warehouseName: varchar("warehouse_name", { length: 100 })
        .notNull()
        .unique(),
        
    warehouseCode: varchar("warehouse_code", { length: 50 }).unique(),

    isActive: boolean("is_active")
        .default(true)
        .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});