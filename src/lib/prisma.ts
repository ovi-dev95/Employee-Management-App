import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
        datasources: {
            db: {
                url: "postgresql://postgres.kdolyswfxzkixknrivao:V%235UT7wE_tbRww%24@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
            },
        },
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
