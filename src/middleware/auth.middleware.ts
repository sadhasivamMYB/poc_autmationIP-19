import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../database/db";
import { users } from "../models/schema";
import { and, eq } from "drizzle-orm";

dotenv.config();

export const authenticate = async (
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { id: string | number };

        req.user = decoded;

        const [user] = await db.select({ role: users.role })
            .from(users)
            .where(and(eq(users.id, Number(decoded.id)), eq(users.status, "ACTIVE")));
        if (!user) {
            res.status(401).json({ message: "Token is not valid" });
            return;
        }
        req.user = { decoded, role: user?.role };
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