import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { db } from "../database/db";
import { warehouses } from "../models/schema/warehouse/warehouse.schema";


export class WarehouseService {

    static getAll = async () => {
        try {
            return db.query.warehouses.findMany();
        }
        catch (err: any) {
            throw err;
        }
    }

    static excelUpload = async (file: any) => {
        try {

            const workbook = XLSX.readFile(file.path);
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) throw new Error("No sheets found in the uploaded file.");
            const worksheet = workbook.Sheets[firstSheetName];
            if (!worksheet) throw new Error(`Worksheet ${firstSheetName} not found in the uploaded file.`);
            const data = XLSX.utils.sheet_to_json(worksheet).splice(1) as Record<string, any>[];


            for (const row of data) {

                console.log(row, "🔃🔃🔃🔃🔃✨")

                const warehouseCode = String(row["location code"]);
                const existing = await db.query.warehouses.findFirst({
                    where: eq(warehouses.warehouseCode, warehouseCode),
                });

                if (existing) {
                    throw new Error(`Warehouse code ${warehouseCode} already exists.`);
                }
            }

            await db.transaction(async (tx) => {
                for (const row of data as any[]) {
                    await tx.insert(warehouses).values({
                        warehouseCode: String(row["warehouse code"]),
                        warehouseName: row["warehouse name"],
                        isActive: true
                    });
                }
            });
            return true;
        } catch (err: any) {
            throw err;
        }
    }
}
