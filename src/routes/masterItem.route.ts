import { Router } from "express";
import { MasterItemsController } from "../controllers/masterItems.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { uploadExcelMasterItems } from "../middleware/excelFile.middleware";

const router = Router();

router.get("/", authenticate, MasterItemsController.getAll);
router.post("/", authenticate, isAdmin, MasterItemsController.create);

router.post("/upload/excel", uploadExcelMasterItems.single("file"), MasterItemsController.excelUpload);

router.get("/:id", authenticate, MasterItemsController.getById);
router.put("/:id", authenticate, isAdmin, MasterItemsController.update);
router.delete("/:id", authenticate, isAdmin, MasterItemsController.delete);


export default router