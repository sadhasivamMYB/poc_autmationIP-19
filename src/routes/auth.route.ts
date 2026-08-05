import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { InvitationController } from "../controllers/invitation.controller";

import {
    authenticate
} from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { LoginLimiter, resendOTPLimiter, VerifyOTPLimiter } from "../utils/ratelimiters";
import { OtpController } from "../controllers/otp.controller";

const router = Router();

router.post(

    "/register",

    authenticate,

    isAdmin,

    AuthController.register

);

router.post(

    "/login",
    LoginLimiter,
    AuthController.login

);

router.get(

    "/profile",

    authenticate,

    AuthController.profile

);
router.post(
    "/microsoft",
    LoginLimiter,
    AuthController.microsoftLogin
);

router.post(
    "/activate-account",
    InvitationController.activateAccount
);

router.post("/verify/otp", VerifyOTPLimiter, OtpController.verifyOTP)

router.post("/resend/otp", resendOTPLimiter, OtpController.resendOTP)

export default router;