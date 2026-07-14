import { pgTable, serial, integer, numeric, date, timestamp, varchar } from "drizzle-orm/pg-core";
import { warehouses } from "../warehouse/warehouse.schema";

export const compareStock = pgTable("compare_stock", {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    warehouseId: integer("warehouse_id").references(() => warehouses.id).notNull(),
    warehouseCode: varchar("warehouse_code", { length: 255 }),
    itemCode: varchar("item_code", { length: 255 }).notNull(),
    itemName: varchar("item_name", { length: 255 }),
    physicalStock: numeric("physical_stock", { precision: 10, scale: 2 }).default("0"),
    systemStock: numeric("system_stock", { precision: 10, scale: 2 }).default("0"),
    difference: numeric("difference", { precision: 10, scale: 2 }).default("0"),
    manual: numeric("manual", { precision: 10, scale: 2 }).default("0"),
    salesReturn: numeric("sales_return", { precision: 10, scale: 2 }).default("0"),
    blocked: numeric("blocked", { precision: 10, scale: 2 }).default("0"),
    stoPending: numeric("sto_pending", { precision: 10, scale: 2 }).default("0"),
    grnPending: numeric("grn_pending", { precision: 10, scale: 2 }).default("0"),
    damages: numeric("damages", { precision: 10, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
