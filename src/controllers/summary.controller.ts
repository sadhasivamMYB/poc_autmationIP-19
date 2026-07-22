import { Request, Response } from "express";
import { db } from "../database/db";
import { dailyStock, masterItems } from "../models/schema/index";
import { and, eq, gte, lte, sum } from "drizzle-orm";

export class SummaryController {
    static async getSummary(req: Request, res: Response) {
        try {
            const { warehouseId, startDate, endDate } = req.query;

            if (!warehouseId || !startDate || !endDate) {
                res.status(400).json({ success: false, message: "Missing required parameters" });
                return;
            }

            const parsedWarehouseId = parseInt(warehouseId as string);

            // Query daily stock within range and join with master items
            const data = await db
                .select({
                    itemCode: masterItems.itemCode,
                    itemName: masterItems.itemName,
                    bottlePerCase: masterItems.bottlePerCase,
                    totalReceivedCases: sum(dailyStock.receivedCases).mapWith(Number),
                    totalReceivedBottles: sum(dailyStock.receivedBottles).mapWith(Number),
                    totalIssuedCases: sum(dailyStock.issuedCases).mapWith(Number),
                    totalIssuedBottles: sum(dailyStock.issuedBottles).mapWith(Number),
                })
                .from(dailyStock)
                .innerJoin(masterItems, eq(dailyStock.itemId, masterItems.id))
                .where(
                    and(
                        eq(dailyStock.warehouseId, parsedWarehouseId),
                        gte(dailyStock.stockDate, startDate as string),
                        lte(dailyStock.stockDate, endDate as string)
                    )
                )
                .groupBy(masterItems.itemCode, masterItems.itemName, masterItems.bottlePerCase);

            // Format to total raw bottles (as expected by frontend)
            const formattedData = data.map((item) => {
                const bpc = item.bottlePerCase || 1;
                return {
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    totalReceived: ((item.totalReceivedCases * bpc + item.totalReceivedBottles) / bpc),
                    totalIssued: ((item.totalIssuedCases * bpc + item.totalIssuedBottles) / bpc),
                };
            });

            res.status(200).json({ success: true, data: formattedData });
        } catch (error) {
            console.error("Error in SummaryController:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
