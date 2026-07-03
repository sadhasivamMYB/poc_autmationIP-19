import { db } from "../db";
import { masterItems } from "../../models/schema/master/master.schema";

export async function seedMasterItems() {
    await db.insert(masterItems).values([
        {
            itemCode: "10004428",
            itemName: "DON JULIO REPOSADO 75CL",
            bottlePerCase: 12,
        },
        {
            itemCode: "10004540",
            itemName: "BLACK & WHITE 70CL",
            bottlePerCase: 12,
        },
        {
            itemCode: "780810",
            itemName: "CIROC PINEAPPLE 1L",
            bottlePerCase: 6,
        },
        {
            itemCode: "744473",
            itemName: "CIROC RED BERRY 1L",
            bottlePerCase: 6,
        },
        {
            itemCode: "756915",
            itemName: "DON JULIO 1942 75CL",
            bottlePerCase: 6,
        },
        {
            itemCode: "766103",
            itemName: "DON JULIO BLANCO 75CL",
            bottlePerCase: 6,
        },
        {
            itemCode: "783347",
            itemName: "DON JULIO REPOSADO 75CL",
            bottlePerCase: 6,
        }
    ]);

    console.log("✅ Master Items Seeded");
}