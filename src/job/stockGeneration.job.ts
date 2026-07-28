import cron from "node-cron";
import { lt, and, ne } from "drizzle-orm";
import { db } from "../database/db";
import { dailyStock } from "../models/schema/dailyStock/dailyStock.schema";
import { StockGenerationService } from "../service/stockGeneration.service"

cron.schedule("0 0 * * *", async () => {
    console.log("Daily Stock Generation triggered");

    const today = new Date()
        .toISOString()
        .split("T")[0] as string;

    console.log("Locking previous days' stock...");
    try {
        await db.update(dailyStock)
            .set({ status: "LOCKED" })
            .where(
                and(
                    lt(dailyStock.stockDate, today),
                    ne(dailyStock.status, "LOCKED")
                )
            );

        console.log("Previous days' stock locked successfully.");
    } catch (err) {
        console.error("Error locking previous days' stock:", err);
    }

    console.log("Generating Daily Stock...");
    await StockGenerationService.generateForDate(today || "");

    console.log("Daily Stock Generated");
});