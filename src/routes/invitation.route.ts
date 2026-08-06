import { Router } from "express";
import { InvitationController } from "../controllers/invitation.controller";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/invite", authenticate, isAdmin, InvitationController.inviteUser);
router.post("/resend/:id", authenticate, isAdmin, InvitationController.resendInvitation);

export default router;
