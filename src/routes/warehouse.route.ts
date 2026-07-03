
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { WarehouseController } from "../controllers/warehouse.controller";

const router = Router();

router.get("/", authenticate, isAdmin, WarehouseController.getWareHouses);

export default router;
