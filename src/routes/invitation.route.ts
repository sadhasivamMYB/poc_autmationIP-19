import { Router } from "express";
import { InvitationController } from "../controllers/invitation.controller";

const router = Router();

router.post("/invite", InvitationController.inviteUser);
router.post("/resend/:id", InvitationController.resendInvitation);

export default router;
