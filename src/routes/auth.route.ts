import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import {
    authenticate
} from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { LoginLimiter } from "../utils/ratelimiters";

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

export default router;