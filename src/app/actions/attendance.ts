"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./user"

export async function checkIn() {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    try {
        // Check if already checked in today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const existing = await prisma.attendance.findFirst({
            where: {
                userId: user.id,
                date: {
                    gte: today
                }
            }
        })

        if (existing) {
            return { error: "Already checked in today" }
        }

        const attendance = await prisma.attendance.create({
            data: {
                userId: user.id,
                checkIn: new Date(),
                date: new Date()
            }
        })

        revalidatePath("/dashboard/attendance")
        return { success: true, data: JSON.parse(JSON.stringify(attendance)) }
    } catch (error) {
        console.error("Check-in error:", error)
        return { error: "Failed to check in" }
    }
}

export async function checkOut() {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const attendance = await prisma.attendance.findFirst({
            where: {
                userId: user.id,
                date: {
                    gte: today
                },
                checkOut: null
            }
        })

        if (!attendance) {
            return { error: "No active check-in found" }
        }

        const checkOutTime = new Date()
        const durationMs = checkOutTime.getTime() - new Date(attendance.checkIn).getTime()
        const durationMinutes = Math.floor(durationMs / 60000)

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: checkOutTime,
                duration: durationMinutes
            }
        })

        revalidatePath("/dashboard/attendance")
        return { success: true, data: JSON.parse(JSON.stringify(updated)) }
    } catch (error) {
        console.error("Check-out error:", error)
        return { error: "Failed to check out" }
    }
}

export async function getMyAttendance() {
    const user = await getCurrentUser()
    if (!user) return []

    try {
        const attendance = await prisma.attendance.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' },
            take: 30
        })
        return JSON.parse(JSON.stringify(attendance))
    } catch (error) {
        return []
    }
}

export async function getTeamAttendance() {
    const user = await getCurrentUser()
    if (!user) return []

    // For now, let everyone see team attendance or restrict to ADMIN/EDITOR
    // if (user.role !== 'ADMIN') return []

    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Get all users and their attendance for today
        const users = await prisma.user.findMany({
            include: {
                attendance: {
                    where: {
                        date: {
                            gte: today
                        }
                    }
                }
            }
        })

        const teamData = users.map(u => {
            const att = u.attendance[0]
            let status = 'Absent'
            let checkIn = '-'
            let avg = '0h' // Placeholder for average calculation

            if (att) {
                status = att.checkOut ? 'Present' : 'Present (Active)'
                checkIn = new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            return {
                id: u.id,
                name: u.name,
                role: u.role, // Mapping role to display role if needed
                dept: u.department,
                status,
                checkIn,
                avg, // Logic for average can be added later
                avatar: u.avatar
            }
        })

        return JSON.parse(JSON.stringify(teamData))
    } catch (error) {
        console.error("Team attendance error:", error)
        return []
    }
}
