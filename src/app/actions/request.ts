"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getRequests() {
    try {
        const requests = await prisma.request.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch requests:", error);
        return [];
    }
}

export async function createRequest(data: {
    title: string;
    description: string;
    type: string;
    priority: string;
    submittedBy: string;
}) {
    try {
        const request = await prisma.request.create({
            data: {
                ...data,
                status: 'PENDING'
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                userId: data.submittedBy,
                action: `Submitted a ${data.type} request: ${data.title}`,
                points: 5
            }
        });

        // Update user points
        await prisma.user.update({
            where: { id: data.submittedBy },
            data: { points: { increment: 5 } }
        });

        revalidatePath("/dashboard/requests");
        revalidatePath("/dashboard");
        return { success: true, request: JSON.parse(JSON.stringify(request)) };
    } catch (error) {
        console.error("Failed to create request:", error);
        return { success: false, error: "Failed to create request" };
    }
}

export async function updateRequest(id: string, data: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
}) {
    try {
        const request = await prisma.request.update({
            where: { id },
            data
        });

        revalidatePath("/dashboard/requests");
        return { success: true, request: JSON.parse(JSON.stringify(request)) };
    } catch (error) {
        console.error("Failed to update request:", error);
        return { success: false, error: "Failed to update request" };
    }
}

export async function deleteRequest(id: string) {
    try {
        await prisma.request.delete({
            where: { id }
        });
        revalidatePath("/dashboard/requests");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete request:", error);
        return { success: false, error: "Failed to delete request" };
    }
}
