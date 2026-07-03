import {
    pgTable,
    serial,
    integer,
    date,
    varchar,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { warehouses } from "../warehouse/warehouse.schema";
import { masterItems } from "../master/master.schema";
import { users } from "../users/users.schema";

export const dailyStock = pgTable(
    "daily_stock",
    {
        id: serial("id").primaryKey(),

        stockDate: date("stock_date").notNull(),

        warehouseId: integer("warehouse_id")
            .references(() => warehouses.id)
            .notNull(),

        itemId: integer("item_id")
            .references(() => masterItems.id)
            .notNull(),

        openingCases: integer("opening_cases").default(0).notNull(),
        openingBottles: integer("opening_bottles").default(0).notNull(),

        receivedCases: integer("received_cases").default(0).notNull(),
        receivedBottles: integer("received_bottles").default(0).notNull(),

        issuedCases: integer("issued_cases").default(0).notNull(),
        issuedBottles: integer("issued_bottles").default(0).notNull(),

        closingCases: integer("closing_cases").default(0).notNull(),
        closingBottles: integer("closing_bottles").default(0).notNull(),

        status: varchar("status", { length: 20 })
            .default("OPEN")
            .notNull(),

        createdBy: integer("created_by").references(() => users.id),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        uniqueDailyItem: unique().on(
            table.stockDate,
            table.warehouseId,
            table.itemId
        ),
    })
);