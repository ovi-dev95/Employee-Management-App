"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"

export async function createRequest(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized" }

    const type = formData.get("type") as string
    const from = formData.get("from") as string
    const to = formData.get("to") as string
    const reason = formData.get("reason") as string

    if (!type || !from || !to || !reason) {
        return { error: "All fields are required" }
    }

    try {
        await prisma.request.create({
            data: {
                title: `${type} Request`,
                description: `${reason} (From: ${from} To: ${to})`,
                type: 'LEAVE', // Mapping UI types to schema types if needed, or just use LEAVE
                priority: 'MEDIUM',
                submittedBy: user.id,
                status: 'PENDING'
            }
        })

        // Log activity
        await prisma.activity.create({
            data: {
                userId: user.id,
                action: `Submitted a leave request: ${type}`,
                points: 0,
                category: "REQUESTS"
            }
        })

        revalidatePath("/dashboard/attendance")
        return { success: true }
    } catch (error) {
        console.error("Request error:", error)
        return { error: "Failed to submit request" }
    }
}
