import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import {
    authenticate
} from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const router = Router();

router.post(

    "/register",

    authenticate,

    isAdmin,

    AuthController.register

);

router.post(

    "/login",

    AuthController.login

);

router.get(

    "/profile",

    authenticate,

    AuthController.profile

);

export default router;