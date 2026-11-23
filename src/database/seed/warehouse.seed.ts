import { db } from "../db";
import { warehouses } from "../../models/schema/warehouse/warehouse.schema";

export async function seedWarehouses() {
    await db.insert(warehouses).values([
        {
            warehouseName: "Lagos",
            warehouseCode: "IK01",
            isActive: true
        },
        {
            warehouseName: "Abuja",
            warehouseCode: " AB01",
            isActive: true
        },
        {
            warehouseName: "Port Harcourt",
            warehouseCode: "PH01",
            isActive: true
        },
        {
            warehouseName: "Benin",
            warehouseCode: "SC01",
            isActive: true

        },
        {
            warehouseName: "LFZ",
            warehouseCode: "FG01",
            isActive: true
        },
    ]);

    console.log("✅ Warehouses Seeded");
}