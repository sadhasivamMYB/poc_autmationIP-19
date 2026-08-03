import { db } from "../database/db";
import { users } from "../models/schema/users/users.schema";

import { eq, and } from "drizzle-orm";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// import {
//     hashPassword,
//     comparePassword,
// } from "../../utils/hash";

import { generateToken } from "../utils/jwtHelper";
import { warehouses } from "../models/schema";
import { verifyMicrosoftToken } from "./microsoft.service";

import { UserStatus } from "../models/enums/userStatus.enum";

import { sanitizeUser } from "../utils/sanitizeUser";

export class AuthService {

    static async register(data: any) {

        // const hashedPassword = await hashPassword(data.password);

        const [user] = await db
            .insert(users)
            .values({
                ...data,
                // password: hashedPassword,
            })
            .returning();

        return sanitizeUser(user);
    }

    static async login(email: string, password: string) {

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user)
            throw new Error("Invalid Credentials");

        if (user.status === UserStatus.INVITED || !user.password) {
            throw new Error("Please activate your account using the invitation email.");
        }

        if (user.status === UserStatus.DISABLED) {
            throw new Error("Your account has been disabled. Please contact your administrator.");
        }

        let isMatch = user.password === password;
        if (!isMatch) {
            // Check bcrypt if applicable
            try {
                isMatch = await bcrypt.compare(password, user.password);
            } catch (e) {
                isMatch = false;
            }
        }

        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }

        const token = generateToken({

            id: user.id,
            warehouseId: user.warehouseId,
            role: user.role,

        });

        return {
            token,
            user: sanitizeUser(user),
        };
    }

    static async microsoftLogin(token: string) {

        // 1. Decode Microsoft Token
        const profile = await verifyMicrosoftToken(token);
        const email = profile?.email || profile?.preferred_username || profile?.upn;

        if (!email) {
            throw new Error("Email not found in Microsoft token.");
        }

        // 2. Find existing user
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        // 3. Reject if not exists
        if (!user) {
            throw new Error("User does not exist in the system. Access denied.");
        }

        // 4. Guard check for user status
        if (user.status === UserStatus.INVITED) {
            throw new Error("Please activate your account using the invitation email.");
        }

        if (user.status === UserStatus.DISABLED) {
            throw new Error("Your account has been disabled. Please contact your administrator.");
        }

        // 5. Generate Application JWT
        const appToken = generateToken({
            id: user.id,
            warehouseId: user.warehouseId,
            role: user.role,
        });

        // 6. Return token and sanitized user DTO
        return {
            token: appToken,
            user: sanitizeUser(user),
        };
    }
}