import { seedWarehouses } from "./warehouse.seed";
import { seedMasterItems } from "./masteritem.seed";

async function seed() {
    try {
        console.log("🌱 Seeding Database...");

        await seedWarehouses();
        await seedMasterItems();

        console.log("🎉 Database Seeded Successfully");

        process.exit(0);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
}

seed();