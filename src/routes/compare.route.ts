import { Router } from "express";
import { CompareController } from "../controllers/compare.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const router = Router();

router.post("/bulk", authenticate, isAdmin, CompareController.bulkSave);
router.put("/bulk", authenticate, isAdmin, CompareController.updateBulk);
router.get("/", authenticate, isAdmin, CompareController.getByDate);

export default router;
