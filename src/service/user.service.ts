import { db } from "../database/db";
import { users } from "../models/schema/users/users.schema";
import { desc, eq, ne } from "drizzle-orm";

export class UserService {
    static async getAll() {
        const result = await db.query.users.findMany({
            with: {
                warehouse: true,
            },

            where: ne(users.role, "ADMIN"),
            orderBy: [desc(users.createdAt)],
        });

        // Map fullName to name for frontend compatibility
        return result.map(u => ({
            ...u,
            name: u.fullName
        }));
    }

    static async getById(id: number) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                warehouse: true,
            },
        });

        if (user) {
            return { ...user, name: user.fullName };
        }
        return null;
    }

    static async create(data: any) {
        const [user] = await db
            .insert(users)
            .values({
                fullName: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                warehouseId: data.warehouseId || null,
            })
            .returning();
        return { ...user, name: user?.fullName };
    }

    static async update(id: number, data: any) {
        const updateData: any = {
            fullName: data.name,
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

        return user ? { ...user, name: user.fullName } : null;
    }

    static async delete(id: number) {
        const [user] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning();
        return user;
    }
}
