import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export const authenticate = (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token is missing.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again.",
                code: "TOKEN_EXPIRED",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token.",
            code: "INVALID_TOKEN",
        });
    }
};