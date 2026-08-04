import { eq, and } from "drizzle-orm";
import ExcelJS from "exceljs";
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
            where: and(
                eq(initialStock.warehouseId, data.warehouseId),
                eq(initialStock.itemId, data.itemId)
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

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];
            if (!worksheet) throw new Error("No sheets found in the uploaded file.");

            const allRows: any[] = [];
            let headers: string[] = [];
            let headerRowFound = false;

            worksheet.eachRow((row) => {
                if (!headerRowFound) {
                    row.eachCell((cell, colNumber) => {
                        headers[colNumber] = cell.value ? String(cell.value) : `__EMPTY_${colNumber}`;
                    });
                    headerRowFound = true;
                } else {
                    const rowData: any = {};
                    let hasData = false;
                    row.eachCell((cell, colNumber) => {
                        if (headers[colNumber] !== undefined) {
                            let val = cell.value;
                            if (val && typeof val === 'object' && 'result' in val) {
                                val = (val as any).result;
                            } else if (val && typeof val === 'object' && 'richText' in val) {
                                val = (val as any).richText.map((rt: any) => rt.text).join('');
                            }
                            rowData[headers[colNumber]] = val;
                            hasData = true;
                        }
                    });
                    if (hasData) {
                        allRows.push(rowData);
                    }
                }
            });

            const data = allRows.splice(1) as Record<string, any>[];


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
                        where: and(
                            eq(initialStock.warehouseId, warehouse.id),
                            eq(initialStock.itemId, item.id)
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