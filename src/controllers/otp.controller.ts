import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../database/db";
import { otp_verification, users } from "../models/schema";
import { Request, Response } from "express";
import { generateToken } from "../utils/jwtHelper";
import { sanitizeUser } from "../utils/sanitizeUser";
import { generate_OTP } from "../utils/OTP_generator";
import { sendOTPEmail } from "../utils/mailer";

export class OtpController {

    static async verifyOTP(req: Request, res: Response) {
        try {
            const body: any = req.body;

            const user = await db.query.users.findFirst({
                where: eq(users.email, body.email),
            });

            if (!user)
                throw new Error("Invalid Credentials");

            const otpVerification = await db.query.otp_verification.findFirst({
                where: eq(otp_verification.userId, user.id),
                orderBy: [desc(otp_verification.expiresAt)]
            });

            if (!otpVerification)
                throw new Error("Invalid Credentials");

            if (otpVerification.otp !== body.otp)
                throw new Error("Wrong OTP");

            if (otpVerification.expiresAt < new Date())
                throw new Error("OTP Expired");

            if (otpVerification.attempts >= 3)
                throw new Error("Invalid Credentials");

            await db.update(otp_verification).set({
                verified: true,
                attempts: otpVerification.attempts + 1,
            }).where(and(eq(otp_verification.userId, user.id), eq(otp_verification.otp, body.otp)));

            const token = generateToken({
                id: user.id,
                warehouseId: user.warehouseId,
                role: user.role,
            });

            res.json({
                success: true,
                data: {
                    token,
                    user: sanitizeUser(user)
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "OTP verification failed"
            });
        }
    }

    static async resendOTP(req: Request, res: Response) {
        try {
            const body: any = req.body;
            const user = await db.query.users.findFirst({
                where: eq(users.email, body.email),
            });
            if (!user)
                throw new Error("Invalid Credentials");

            const otp = generate_OTP();

            await db.insert(otp_verification).values({
                userId: user.id,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                attempts: 0
            });

            sendOTPEmail(body.email, otp);

            res.json({
                success: true,
                message: "OTP resent successfully"
            })

        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "OTP resend failed"
            });
        }
    }

}