import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, isAdmin, UserController.getAllUsers);
router.get("/:id", authenticate, isAdmin, UserController.getUserById);
router.post("/", authenticate, isAdmin, UserController.createUser);
router.put("/:id", authenticate, isAdmin, UserController.updateUser);
router.delete("/:id", authenticate, isAdmin, UserController.deleteUser);

export default router;
