import { db } from "../database/db";
import { masterItems, users, warehouses } from "../models/schema";

export class DashboardController {

    static async adminDashboardStats(req: any, res: any) {
        try {

            const totalMasterItems = (await db.select().from(masterItems)).length;
            const totalWarehouses = (await db.select().from(warehouses)).length;
            const totalUsers = (await db.select().from(users)).length;


            return res.status(200).json({
                success: true,
                data: {
                    totalMasterItems,
                    totalWarehouses,
                    totalUsers
                },
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

}