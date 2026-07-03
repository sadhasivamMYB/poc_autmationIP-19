import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { uploadExcelGeneral } from "../middleware/excelFile.middleware";
import { InitialStockController } from "../controllers/initialStock.controller";
import { WarehouseController } from "../controllers/warehouse.controller";

const router = Router();

router.post("/upload/inital-stock", uploadExcelGeneral.single("file"), InitialStockController.excelUpload);
router.post("/upload/warehouse", uploadExcelGeneral.single("file"), WarehouseController.excelUpload);

export default router;
