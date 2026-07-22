import { Router } from "express";
import { SummaryController } from "../controllers/summary.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, SummaryController.getSummary);

export default router;
