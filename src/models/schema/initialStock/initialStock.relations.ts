import { relations } from 'drizzle-orm';
import { initialStock } from './initialStock.schema';
import { warehouses } from '../warehouse/warehouse.schema';
import { masterItems } from '../master/master.schema';
import { dailyStock } from "../dailyStock/dailyStock.schema";



export const initialStockRelations = relations(initialStock, ({ one }) => ({
    warehouse: one(warehouses, {
        fields: [initialStock.warehouseId],
        references: [warehouses.id],
    }),
    item: one(masterItems, {
        fields: [initialStock.itemId],
        references: [masterItems.id],
    }),
}));



export const dailyStockRelations = relations(dailyStock, ({ one }) => ({
    masterItem: one(masterItems, {
        fields: [dailyStock.itemId],
        references: [masterItems.id],
    }),
}));