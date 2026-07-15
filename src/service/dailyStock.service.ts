import { db } from "../database/db";

import { dailyStock } from "../models/schema/dailyStock/dailyStock.schema";

import { eq, asc, and } from "drizzle-orm";
import { StockCalculationService } from "./stockCalculation.service";
import { masterItems } from "../models/schema";
import { StockGenerationService } from "./stockGeneration.service";


export class DailyStockService {

    static async getToday(
        warehouseId: number
    ) {

        const today = new Date()
            .toISOString()
            .split("T")[0];

        /**
         * Check if today's stock exists
         */

        const exists =
            await db.query.dailyStock.findFirst({
                where: and(
                    eq(dailyStock.stockDate, today),
                    eq(dailyStock.warehouseId, warehouseId)
                ),
            });

        /**
         * Auto-generate today's stock if missing
         */

        if (!exists) {

            await StockGenerationService.generateForWarehouse(
                String(today),
                warehouseId
            );

        }

        /**
         * Return today's stock
         */

        const stocks = await db
            .select({

                id: dailyStock.id,

                stockDate: dailyStock.stockDate,

                itemId: dailyStock.itemId,

                itemCode: masterItems.itemCode,

                itemName: masterItems.itemName,

                bottlePerCase: masterItems.bottlePerCase,

                openingCases: dailyStock.openingCases,
                openingBottles: dailyStock.openingBottles,

                receivedCases: dailyStock.receivedCases,
                receivedBottles: dailyStock.receivedBottles,

                issuedCases: dailyStock.issuedCases,
                issuedBottles: dailyStock.issuedBottles,

                closingCases: dailyStock.closingCases,
                closingBottles: dailyStock.closingBottles,

                status: dailyStock.status,

            })
            .from(dailyStock)
            .innerJoin(
                masterItems,
                eq(dailyStock.itemId, masterItems.id)
            )
            .where(
                and(
                    eq(dailyStock.stockDate, today),
                    eq(dailyStock.warehouseId, warehouseId)
                )
            )
            .orderBy(
                asc(masterItems.itemCode)
            );

        return stocks;

    }

    static async bulkUpdate(stocks: any[]) {


        console.log("enterd to update")
        const result = await db.transaction(async (tx) => {

            const updatedRows = [];

            for (const stock of stocks) {




                const existing =
                    await tx.query.dailyStock.findFirst({

                        where: eq(
                            dailyStock.id,
                            stock.id
                        ),

                    })


                const existingMasterItem = await tx.query.masterItems.findFirst({
                    where: eq(masterItems.id, stock.itemId)

                })


                if (!existing) {

                    throw new Error(
                        `Stock ${stock.id} not found`
                    );

                }

                if (existing.status === "LOCKED") {

                    throw new Error(
                        `Stock ${stock.id} already locked`
                    );

                }

                const closing =
                    StockCalculationService.calculateClosing({

                        openingCases:
                            existing.openingCases,

                        openingBottles:
                            existing.openingBottles,

                        receivedCases:
                            stock.receivedCases,

                        receivedBottles:
                            stock.receivedBottles,

                        issuedCases:
                            stock.issuedCases,

                        issuedBottles:
                            stock.issuedBottles,

                        bottlePerCase:
                            existingMasterItem!.bottlePerCase,

                    });

                const updated =
                    await tx.update(dailyStock)

                        .set({

                            receivedCases:
                                stock.receivedCases,

                            receivedBottles:
                                stock.receivedBottles,

                            issuedCases:
                                stock.issuedCases,

                            issuedBottles:
                                stock.issuedBottles,

                            closingCases:
                                closing.cases,

                            closingBottles:
                                closing.bottles,

                            updatedAt:
                                new Date(),

                        })

                        .where(
                            eq(
                                dailyStock.id,
                                stock.id
                            )
                        )

                        .returning();

                updatedRows.push(updated[0]);

            }

            return updatedRows;

        });

        return result

    }

    static async customDateStockHistory(date: string, warehouseId: number) {

        const customDate = new Date(date)
            .toISOString()
            .split("T")[0];

        const stocks = await db
            .select({

                id: dailyStock.id,

                stockDate: dailyStock.stockDate,

                itemId: dailyStock.itemId,

                itemCode: masterItems.itemCode,

                itemName: masterItems.itemName,

                bottlePerCase: masterItems.bottlePerCase,

                openingCases: dailyStock.openingCases,
                openingBottles: dailyStock.openingBottles,

                receivedCases: dailyStock.receivedCases,
                receivedBottles: dailyStock.receivedBottles,

                issuedCases: dailyStock.issuedCases,
                issuedBottles: dailyStock.issuedBottles,

                closingCases: dailyStock.closingCases,
                closingBottles: dailyStock.closingBottles,

                status: dailyStock.status,

            })
            .from(dailyStock)
            .innerJoin(
                masterItems,
                eq(dailyStock.itemId, masterItems.id)
            )
            .where(
                and(
                    eq(dailyStock.stockDate, customDate),
                    eq(dailyStock.warehouseId, warehouseId)
                )
            )
            .orderBy(
                asc(masterItems.itemCode)
            );

        return stocks;

    }


}