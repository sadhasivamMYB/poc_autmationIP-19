import { and, eq } from "drizzle-orm";

import { db } from "../database/db";

import { dailyStock } from '../models/schema/dailyStock/dailyStock.schema';
import { initialStock } from '../models/schema/initialStock/initialStock.schema';
import { masterItems } from '../models/schema/master/master.schema';
import { warehouses } from '../models/schema/warehouse/warehouse.schema';

export class StockGenerationService {
    /**
     * Generate stock for all warehouses
     */
    static async generateForDate(date: string) {
        const allWarehouses = await db.query.warehouses.findMany({
            where: eq(warehouses.isActive, true),
        });

        for (const warehouse of allWarehouses) {
            await this.generateForWarehouse(date, warehouse.id);
        }

        return {
            success: true,
            message: `Stock generated for ${allWarehouses.length} warehouse(s).`,
        };
    }

    /**
     * Generate stock for a single warehouse
     */
    static async generateForWarehouse(
        date: string,
        warehouseId: number
    ) {
        // Prevent duplicate generation
        const existing = await db.query.dailyStock.findFirst({
            where: and(
                eq(dailyStock.stockDate, date),
                eq(dailyStock.warehouseId, warehouseId)
            ),
        });

        if (existing) {
            return;
        }

        const items = await db.query.masterItems.findMany({
            where: eq(masterItems.isActive, true),
        });

        const records = [];

        for (const item of items) {
            const yesterday = await this.getYesterdayStock(
                date,
                warehouseId,
                item.id
            );

            let openingCases = 0;
            let openingBottles = 0;

            if (yesterday) {
                openingCases = yesterday.closingCases;
                openingBottles = yesterday.closingBottles;
            } else {
                const initial = await this.getInitialStock(
                    warehouseId,
                    item.id
                );

                if (initial) {
                    openingCases = initial.openingCases;
                    openingBottles = initial.openingBottles;
                }
            }

            records.push({
                stockDate: date,

                warehouseId,

                itemId: item.id,

                openingCases,
                openingBottles,

                receivedCases: 0,
                receivedBottles: 0,

                issuedCases: 0,
                issuedBottles: 0,

                closingCases: 0,
                closingBottles: 0,

                status: "OPEN",
            });
        }

        await this.createDailyRecords(records);
    }

    /**
     * Get yesterday closing stock
     */
    static async getYesterdayStock(
        currentDate: string,
        warehouseId: number,
        itemId: number
    ) {
        const yesterday = new Date(currentDate);

        yesterday.setDate(yesterday.getDate() - 1);

        const previousDate = yesterday.toISOString().split("T")[0];

        return db.query.dailyStock.findFirst({
            where: and(
                eq(dailyStock.stockDate, previousDate),
                eq(dailyStock.warehouseId, warehouseId),
                eq(dailyStock.itemId, itemId)
            ),
        });
    }

    /**
     * Get initial stock
     */
    static async getInitialStock(
        warehouseId: number,
        itemId: number
    ) {
        return db.query.initialStock.findFirst({
            where: and(
                eq(initialStock.warehouseId, warehouseId),
                eq(initialStock.itemId, itemId)
            ),
        });
    }

    /**
     * Bulk insert today's records
     */
    static async createDailyRecords(records: any[]) {
        if (!records.length) return;

        await db.insert(dailyStock).values(records);
    }
}