import { relations } from "drizzle-orm";
import { users } from "./users.schema";
import { warehouses } from "../warehouse/warehouse.schema";

export const usersRelations = relations(users, ({ one }) => ({
    warehouse: one(warehouses, {
        fields: [users.warehouseId],
        references: [warehouses.id],
    }),
}));
