import cron from "node-cron";
import { InvitationRepository } from "../repository/invitation.repository";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Running invitation cleanup cron job...");
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await InvitationRepository.deleteOldInvitations(thirtyDaysAgo);
        console.log("Expired/used invitations older than 30 days cleaned up successfully.");
    } catch (err: any) {
        console.error("Failed to clean up old invitations:", err.message);
    }
});
