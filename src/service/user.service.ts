import { db } from "../database/db";
import { users } from "../models/schema/users/users.schema";
import { desc, eq, ne } from "drizzle-orm";
import { sanitizeUser } from "../utils/sanitizeUser";

export class UserService {
    static async getAll() {
        return await db.query.users.findMany({
            columns: {
                password: false,
            },
            with: {
                warehouse: true,
            },

            where: ne(users.role, "ADMIN"),
            orderBy: [desc(users.createdAt)],
        });
    }

    static async getById(id: number) {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                password: false,
            },
            with: {
                warehouse: true,
            },
        });
    }

    static async create(data: any) {
        const [user] = await db
            .insert(users)
            .values({
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                role: data.role,
                warehouseId: data.warehouseId || null,
            })
            .returning();
        return sanitizeUser(user);
    }

    static async update(id: number, data: any) {
        const updateData: any = {
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            warehouseId: data.warehouseId || null,
        };

        if (data.password) {
            updateData.password = data.password;
        }

        const [user] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();

        return sanitizeUser(user);
    }

    static async delete(id: number) {
        const [user] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning();
        return sanitizeUser(user);
    }
}
