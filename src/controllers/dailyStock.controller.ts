import { Request, Response } from "express";
import { DailyStockService } from "../service/dailyStock.service";
import { db } from "../database/db";
import { eq } from "drizzle-orm";
import { warehouses } from "../models/schema";

export class DailyStockController {


    static async getToday(
        req: any,
        res: Response
    ) {
        try {
            console.log(req.user, "🔃🔃🔃🔃⚠️👤")

            const warehouseId = req.user.warehouseId;

            const warehouse = await db.query.warehouses.findFirst({
                where: eq(warehouses.id, warehouseId),
                columns: {
                    warehouseName: true,
                    id: true,
                }
            })

            console.log(warehouse, "WarehouseName")


            const stocks =
                await DailyStockService.getToday(warehouseId);

            return res.status(200).json({
                success: true,
                data: stocks,
                warehouseDetail: warehouse
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    static async bulkUpdate(
        req: Request,
        res: Response
    ) {

        try {

            const { stocks } = req.body;

            // console.log(stocks, "❌❌")

            const result =
                await DailyStockService.bulkUpdate(stocks);

            return res.status(200).json({
                success: true,
                message: "Daily stock updated successfully.",
                data: result,
            });

        } catch (error: any) {

            console.log(error)

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    }


    // only for Admin
    static async customDateStockHistory(
        req: any,
        res: Response
    ) {
        try {

            const { warehouseId, date } = req.query;

            const warehouse = await db.query.warehouses.findFirst({
                where: eq(warehouses.id, warehouseId),
                columns: {
                    warehouseName: true,
                    id: true,
                }
            })

            console.log(warehouse, "WarehouseName")


            const stocks =
                await DailyStockService.customDateStockHistory(date, warehouseId);

            return res.status(200).json({
                success: true,
                data: stocks,
                warehouseDetail: warehouse
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    static async lockStockEdit(req: any, res: any) {
        try {

        } catch (err) {

        }
    }

}