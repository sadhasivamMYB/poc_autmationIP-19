import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { warehouses } from "../models/schema/warehouse/warehouse.schema";
import { masterItems } from "../models/schema/master/master.schema";

import { db } from "../database/db";

import { initialStock } from "../models/schema/initialStock/initialStock.schema"

export class InitialStockService {

    static async create(data: {
        warehouseId: number;
        itemId: number;
        openingCases: number;
        openingBottles: number;
    }) {

        const existing = await db.query.initialStock.findFirst({
            where: (table, { and, eq }) =>
                and(
                    eq(table.warehouseId, data.warehouseId),
                    eq(table.itemId, data.itemId)
                ),
        });

        if (existing) {
            throw new Error("Initial stock already exists.");
        }

        const [stock] = await db
            .insert(initialStock)
            .values(data)
            .returning();

        return stock;
    }

    static async getAll() {

        return await db.query.initialStock.findMany({
            with: {
                warehouse: true,
                item: true,
            },
        });

    }

    static async getByWarehouse(warehouseId: number) {

        return await db.query.initialStock.findMany({

            where: eq(initialStock.warehouseId, warehouseId),

            with: {

                warehouse: true,

                item: true,

            },

        });

    }

    static async update(
        id: number,
        data: Partial<{
            openingCases: number;
            openingBottles: number;
        }>
    ) {

        const [stock] = await db
            .update(initialStock)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(initialStock.id, id))
            .returning();

        if (!stock)
            throw new Error("Initial stock not found.");

        return stock;

    }

    static async delete(id: number) {

        const [stock] = await db
            .delete(initialStock)
            .where(eq(initialStock.id, id))
            .returning();

        if (!stock)
            throw new Error("Initial stock not found.");

        return stock;

    }

    static async excelUpload(file: any) {

        try {
            const workbook = XLSX.readFile(file.path);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet).splice(1);

            await db.transaction(async (tx) => {
                for (const row of data as any[]) {
                    const warehouseCode = String(row["warehouse code"]);
                    const itemCode = String(row["item code"]);


                    const warehouse = await tx.query.warehouses.findFirst({
                        where: eq(warehouses.warehouseCode, warehouseCode)
                    });

                    if (!warehouse?.id) throw new Error(`Warehouse code ${warehouseCode} not found.`);

                    const item = await tx.query.masterItems.findFirst({
                        where: eq(masterItems.itemCode, itemCode)
                    });
                    if (!item) throw new Error(`Item code ${itemCode} not found.`);

                    const existing = await tx.query.initialStock.findFirst({
                        where: (table, { and, eq }) =>
                            and(
                                eq(table.warehouseId, warehouse.id),
                                eq(table.itemId, item.id)
                            ),
                    });
                    if (existing) {
                        throw new Error(`Initial stock for item ${itemCode} in warehouse ${warehouseCode} already exists.`);
                    }

                    await tx.insert(initialStock).values({
                        warehouseId: warehouse.id,
                        itemId: item.id,
                        openingCases: Number(row["cases"]) || 0,
                        openingBottles: Number(row["bottles"]) || 0,
                    });
                }
            });

            return true;
        } catch (err: any) {
            throw err;
        }
    }
}