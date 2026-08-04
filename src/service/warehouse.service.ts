import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";
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


            for (const row of data) {

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
