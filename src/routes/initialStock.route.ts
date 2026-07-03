import { Router } from "express";

import { InitialStockController } from "../controllers/initialStock.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const router = Router();

router.post(
    "/", authenticate, isAdmin, InitialStockController.create
);

router.get(
    "/", authenticate, isAdmin, InitialStockController.getAll
);

router.get(
    "/:warehouseId", authenticate, isAdmin,
    InitialStockController.getByWarehouse
);

// router.put(
//     "/:id", authenticate, isAdmin, InitialStockController.update
// );

// router.delete(
//     "/:id", authenticate, isAdmin,
//     InitialStockController.delete
// );

export default router;