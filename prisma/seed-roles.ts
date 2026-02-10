
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('123456', 12)

    const roles = [
        { name: 'Editor User', email: 'editor@test.com', role: 'EDITOR' },
        { name: 'Subscriber User', email: 'subscriber@test.com', role: 'SUBSCRIBER' }
    ]

    for (const r of roles) {
        const user = await prisma.user.upsert({
            where: { email: r.email },
            update: {},
            create: {
                email: r.email,
                name: r.name,
                role: r.role,
                password,
                department: 'WEB'
            }
        })
        console.log(`Created/Found ${r.role}: ${user.email} (Password: 123456)`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
