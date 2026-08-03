import { db } from "../database/db";
import { users } from "../models/schema/users/users.schema";
import { userInvitations } from "../models/schema/users/userInvitations.schema";
import { UserStatus } from "../models/enums/userStatus.enum";
import { InvitationRepository } from "../repository/invitation.repository";
import { generateSecureToken, hashToken } from "../utils/token";
import { sendInvitationEmail } from "../utils/mailer";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class InvitationService {
    static async inviteUser(data: { email: string; fullName?: string; role: string; warehouseId?: number }) {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, data.email),
        });

        if (existingUser) {
            if (existingUser.status === UserStatus.ACTIVE) {
                throw new Error("User already exists and is active.");
            }
            if (existingUser.status === UserStatus.INVITED) {
                throw new Error("User has already been invited. Use resend invitation if needed.");
            }
        }

        const { rawToken, tokenHash } = generateSecureToken();

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const fullName = data?.fullName as string;

        const newUser = await db.transaction(async (tx) => {
            const [createdUser] = await tx
                .insert(users)
                .values({
                    fullName,
                    email: data.email,
                    password: null,
                    role: data.role,
                    warehouseId: data.warehouseId || null,
                    status: UserStatus.INVITED,
                })
                .returning();

            if (!createdUser) {
                throw new Error("Failed to create user");
            }

            await InvitationRepository.createInvitation(
                {
                    userId: createdUser.id,
                    tokenHash,
                    expiresAt,
                },
                tx
            );

            return createdUser;
        });
        try {
            await sendInvitationEmail(data.email, rawToken);

            return {
                success: true,
                data: newUser,
                message: "Invitation email sent successfully."
            };

        } catch (err) {

            return {
                success: false,
                message: "User created, but failed to send invitation email."
            };
        }

    }


    static async activateAccount(data: { token: string; password: string }) {
        const tokenHash = hashToken(data.token);

        const invitation = await InvitationRepository.findByTokenHash(tokenHash);

        if (!invitation) {
            throw new Error("Invalid or missing invitation token.");
        }

        if (invitation.usedAt) {
            throw new Error("This invitation has already been used.");
        }

        if (new Date() > new Date(invitation.expiresAt)) {
            throw new Error("Invitation token has expired. Please ask an administrator for a new invitation.");
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        await db.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    password: passwordHash,
                    status: UserStatus.ACTIVE,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, invitation.userId));

            await tx
                .update(userInvitations)
                .set({
                    usedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(userInvitations.id, invitation.id));
        });

        return { message: "Account activated successfully." };
    }

    static async resendInvitation(userId: number) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            throw new Error("User not found.");
        }

        if (user.status === UserStatus.ACTIVE) {
            throw new Error("User is already active.");
        }

        const { rawToken, tokenHash } = generateSecureToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.transaction(async (tx) => {
            await InvitationRepository.invalidateUserInvitations(userId, tx);

            await InvitationRepository.createInvitation(
                {
                    userId,
                    tokenHash,
                    expiresAt,
                },
                tx
            );
        });

        sendInvitationEmail(user.email, rawToken);

        return { message: "Invitation resent successfully." };
    }
}
