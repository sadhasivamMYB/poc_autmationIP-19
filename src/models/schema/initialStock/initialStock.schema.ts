import {
    pgTable,
    serial,
    integer,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { warehouses } from "../warehouse/warehouse.schema";
import { masterItems } from "../master/master.schema";

export const initialStock = pgTable(
    "initial_stock",
    {
        id: serial("id").primaryKey(),

        warehouseId: integer("warehouse_id")
            .references(() => warehouses.id)
            .notNull(),

        itemId: integer("item_id")
            .references(() => masterItems.id)
            .notNull(),

        openingCases: integer("opening_cases")
            .default(0)
            .notNull(),

        openingBottles: integer("opening_bottles")
            .default(0)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        uniqueWarehouseItem: unique().on(
            table.warehouseId,
            table.itemId
        ),
    })
);