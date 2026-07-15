import { Request, Response } from "express";
import { db } from "../database/db";
import { compareStock } from "../models/schema";
import { eq } from "drizzle-orm";

export class CompareController {
    static async bulkSave(req: Request, res: Response) {
        try {
            const { date, data } = req.body;
            if (!date || !data || !Array.isArray(data)) {
                return res.status(400).json({ success: false, message: "Invalid payload" });
            }

            await db.transaction(async (tx) => {
                // Delete existing for this date to replace
                await tx.delete(compareStock).where(eq(compareStock.date, date));

                if (data.length > 0) {
                    // Insert new records
                    await tx.insert(compareStock).values(data.map(item => ({
                        date: item.date,
                        warehouseId: item.warehouseId,
                        warehouseCode: item.warehouseCode,
                        itemCode: item.itemCode,
                        itemName: item.itemName,
                        physicalStock: item.physicalStock?.toString() || "0",
                        systemStock: item.systemStock?.toString() || "0",
                        difference: item.difference?.toString() || "0",
                        manual: item.manual?.toString() || "0",
                        salesReturn: item.salesReturn?.toString() || "0",
                        blocked: item.blocked?.toString() || "0",
                        stoPending: item.stoPending?.toString() || "0",
                        grnPending: item.grnPending?.toString() || "0",
                        damages: item.damages?.toString() || "0",
                        pendingSupply: item.pendingSupply?.toString() || "0",
                    })));
                }
            });

            return res.status(200).json({ success: true, message: "Comparison data saved successfully." });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateBulk(req: Request, res: Response) {
        try {
            const { data } = req.body;
            if (!data || !Array.isArray(data)) {
                return res.status(400).json({ success: false, message: "Invalid payload" });
            }

            await db.transaction(async (tx) => {
                for (const item of data) {
                    if (item.id) {
                        await tx.update(compareStock).set({
                            difference: item.difference?.toString() || "0",
                            manual: item.manual?.toString() || "0",
                            salesReturn: item.salesReturn?.toString() || "0",
                            blocked: item.blocked?.toString() || "0",
                            stoPending: item.stoPending?.toString() || "0",
                            grnPending: item.grnPending?.toString() || "0",
                            damages: item.damages?.toString() || "0",
                            pendingSupply: item.pendingSupply?.toString() || "0",
                        }).where(eq(compareStock.id, item.id));
                    }
                }
            });

            return res.status(200).json({ success: true, message: "Comparison data updated successfully." });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getByDate(req: Request, res: Response) {
        try {
            const { date } = req.query;
            if (!date || typeof date !== "string") {
                return res.status(400).json({ success: false, message: "Date is required" });
            }

            const data = await db.select().from(compareStock).where(eq(compareStock.date, date));
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}