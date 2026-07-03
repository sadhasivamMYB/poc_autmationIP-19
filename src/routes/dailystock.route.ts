import { Router } from "express";

import { DailyStockController } from "../controllers/dailyStock.controller";
import { authenticate } from "../middleware/auth.middleware";
import { QueryBuilder } from "drizzle-orm/gel-core";
import { isAdmin } from "../middleware/isAdmin.middleware";

const router = Router();

/**
 * Admin
 */
// router.post(
//     "/generate",
//     DailyStockController.generate
// );

// router.post(
//     "/lock",
//     DailyStockController.lock
// );

// router.post(
//     "/unlock",
//     DailyStockController.unlock
// );

/**
 * Warehouse User
 */


router.get(
    "/today", authenticate,
    DailyStockController.getToday
);

// router.get(
//     "/history",
//     DailyStockController.getHistory
// );

router.put(
    "/bulk", authenticate,
    DailyStockController.bulkUpdate
);

router.get("/history", authenticate, isAdmin, DailyStockController.customDateStockHistory)

/**
 * Reports
 */
// router.get(
//     "/report",
//     DailyStockController.report
// );

// router.get(
//     "/:id",
//     DailyStockController.getById
// );

export default router;