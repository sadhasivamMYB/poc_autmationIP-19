import { seedWarehouses } from "./warehouse.seed";
import { seedMasterItems } from "./masteritem.seed";
import { seedUsers } from "./user.seed";

async function seed() {
    try {
        console.log("🌱 Seeding Database...");

        await seedWarehouses();
        await seedMasterItems();
        await seedUsers();

        console.log("🎉 Database Seeded Successfully");

        process.exit(0);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
}

seed();