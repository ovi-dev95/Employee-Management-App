"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function runSeed() {
    try {
        console.log('Start seeding via Server Action ...')

        // 1. Clear existing data
        // We delete in order of constraints
        // Note: In production, be careful. This wipes data.
        // But the user requested a fix for login, effectively a reset.

        // Deleting dependent records first
        await prisma.activity.deleteMany()
        await prisma.vote.deleteMany()
        await prisma.idea.deleteMany()
        await prisma.request.deleteMany()
        await prisma.meeting.deleteMany()
        await prisma.attendance.deleteMany()

        // Delete users
        await prisma.user.deleteMany()

        // Delete settings
        await prisma.systemSettings.deleteMany()

        // 2. Create System Settings
        await prisma.systemSettings.create({
            data: {
                id: 'global',
                checkInTime: '10:00 AM',
                checkOutTime: '06:00 PM',
                sickLeaveDays: 12,
                paidLeaveDays: 15,
                yearlyLeaveDays: 20
            }
        })

        // 3. Hash password
        const hashedPassword = await bcrypt.hash('password123', 10)

        // 4. Create Users

        // Admin
        const admin = await prisma.user.create({
            data: {
                email: 'ovi@razibmarketing.net',
                name: 'Md Atiar Rahman Ovi',
                role: 'ADMIN',
                department: 'WEB',
                password: hashedPassword,
                points: 1350,
                position: 'System Administrator',
                avatar: "https://avatar.vercel.sh/admin",
            }
        })

        // Editor / Team Lead
        const editor = await prisma.user.create({
            data: {
                email: 'lead@nexus.com',
                name: 'Team Lead',
                role: 'EDITOR',
                department: 'SEO',
                password: hashedPassword,
                position: 'SEO Lead',
                avatar: "https://avatar.vercel.sh/lead",
            }
        })

        // Subscriber / Team Member
        const subscriber = await prisma.user.create({
            data: {
                email: 'member@nexus.com',
                name: 'Team Member',
                role: 'SUBSCRIBER',
                department: 'UI_UX',
                password: hashedPassword,
                position: 'UI Designer',
                avatar: "https://avatar.vercel.sh/member",
            }
        })

        // 5. Create SOPs
        await prisma.sOP.create({
            data: {
                title: 'How to Deploy to Vercel',
                category: 'WEB_DEV',
                content: '1. Commit code.\n2. Push to main.\n3. Vercel automatically deploys.',
                videoUrl: 'https://loom.com/share/example',
            },
        })

        await prisma.sOP.create({
            data: {
                title: 'SEO Checklist for New Pages',
                category: 'SEO',
                content: '- [ ] Meta Title\n- [ ] Meta Description\n- [ ] H1 Tag',
                videoUrl: 'https://loom.com/share/example2',
            },
        })

        // 6. Valid Requests
        await prisma.request.create({
            data: {
                title: 'Fix typo on Homepage',
                description: 'There is a typo in the hero section.',
                type: 'BUG',
                submittedBy: subscriber.id,
            },
        })

        // 7. Ideas
        await prisma.idea.create({
            data: {
                title: 'Automated Daily Reports',
                description: 'We should automate the daily SEO report generation.',
                submittedBy: editor.id,
            },
        })

        console.log('Seeding finished via Server Action.')

        revalidatePath('/')
        return { success: true, message: "Database reset and seeded successfully!" }

    } catch (error) {
        console.error("Seeding error:", error)
        return { success: false, message: `Seeding failed: ${(error as Error).message}` }
    }
}
