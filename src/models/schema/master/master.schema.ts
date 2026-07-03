import {
    pgTable,
    serial,
    varchar,
    integer,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const masterItems = pgTable("master_items", {
    id: serial("id").primaryKey(),

    itemCode: varchar("item_code", { length: 50 })
        .notNull()
        .unique(),

    itemName: varchar("item_name", { length: 255 })
        .notNull(),

    bottlePerCase: integer("bottle_per_case")
        .notNull(),

    isActive: boolean("is_active")
        .default(true)
        .notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});