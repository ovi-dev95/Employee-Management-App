
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.kdolyswfxzkixknrivao:V%235UT7wE_tbRww%24@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    }
})

async function main() {
    try {
        console.log("Attempting to connect to PROD DB...");
        const count = await prisma.user.count();
        console.log(`Connection SUCCESS! Found ${count} users.`);
    } catch (e) {
        console.error("Connection FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
