import { Request, Response } from "express";

import { AuthService } from "../service/auth.service";
import { LoginRequest, RegisterRequest, MicrosoftLoginRequest } from "../zod/auth.zod";

import { sanitizeUser } from "../utils/sanitizeUser";

export class AuthController {

    static async register(req: Request, res: Response) {
        const body: RegisterRequest = req.body;
        const user = await AuthService.register(body);
        res.status(201).json({
            success: true,
            data: user
        });

    }

    static async login(req: Request, res: Response) {
        try {
            const body: LoginRequest = req.body;
            const data = await AuthService.login(
                body.email,
                body.password
            );

            res.json({
                success: true,
                data
            });
        } catch (error: any) {
            const errMessage = error.message || "Login failed";
            if (errMessage === "Your account has been deactivated. Please contact your administrator.") {
                return res.status(403).json({
                    success: false,
                    message: errMessage
                });
            }
            return res.status(400).json({
                success: false,
                message: errMessage
            });
        }
    }

    static async profile(req: any, res: Response) {

        res.json({
            success: true,
            data: sanitizeUser(req.user)
        });

    }

    static async microsoftLogin(req: Request, res: Response) {
        try {
            const body: MicrosoftLoginRequest = req.body;
            const token = body.token;
            const response = await AuthService.microsoftLogin(token);

            res.json({
                success: true,
                data: response
            });
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Microsoft login error:", err.message);
            if (err.message === "Your account has been deactivated. Please contact your administrator.") {
                return res.status(403).json({
                    success: false,
                    message: err.message
                });
            }
            res.status(401).json({
                success: false,
                message: err.message === "User does not exist in the system. Access denied."
                    ? "User does not exist. Please contact your administrator."
                    : err.message || "Authentication failed."
            });
        }
    };

}