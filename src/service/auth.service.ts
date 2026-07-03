import { db } from "../database/db";
import { users } from "../models/schema/users/users.schema";

import { eq, and } from "drizzle-orm";

// import {
//     hashPassword,
//     comparePassword,
// } from "../../utils/hash";

import { generateToken } from "../utils/jwtHelper";
import { warehouses } from "../models/schema";

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

        return user;
    }

    static async login(email: string, password: string) {

        const conditions = [
            eq(users.email, email),
            eq(users.password, password),
        ];

        const user = await db.query.users.findFirst({
            where: and(...conditions),
        });

        if (!user)
            throw new Error("Invalid Credentials");

        // const isValid = await comparePassword(
        //     password,
        //     user.password
        // );

        // if (!isValid)
        //     throw new Error("Invalid Credentials");

        const token = generateToken({

            id: user.id,
            warehouseId: user.warehouseId,
            role: user.role,

        });

        return {

            token,

            user,

        };
    }

}