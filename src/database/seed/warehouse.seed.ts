import { db } from "../db";
import { warehouses } from "../../models/schema/warehouse/warehouse.schema";

export async function seedWarehouses() {
    await db.insert(warehouses).values([
        {
            warehouseName: "Lagos",
        },
        {
            warehouseName: "Abuja",
        },
        {
            warehouseName: "Port Harcourt",
        },
        {
            warehouseName: "Ibadan",
        },
        {
            warehouseName: "Kano",
        },
    ]);

    console.log("✅ Warehouses Seeded");
}