import { users } from "../../models/schema";
import { db } from "../db";

export async function seedUsers() {


    await db.insert(users).values(
        [{


            fullName: "admin",
            email: "admin@company.com",
            password: "admin@123",
            role: "ADMIN",
            status: "ACTIVE"
        },

        {
            fullName: "User 1",
            email: "user1@company.com",
            password: "user1@123",
            role: "USER",
            warehouseId: 1,
            status: "ACTIVE"
        },
        {
            fullName: "User 2",
            email: "user2@company.com",
            password: "user1@123",
            role: "USER",
            warehouseId: 2,
            status: "ACTIVE"
        }
        ]

    )

    console.log("Users Data Seeded Successfully.... ")


}