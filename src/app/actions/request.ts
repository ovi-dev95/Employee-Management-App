"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/app/actions/user"

export async function getRequests() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return [];

        const isManager = currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR';

        const requests = await prisma.request.findMany({
            where: isManager ? {} : { submittedBy: currentUser.id },
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
    submittedBy: string; // Kept for type compatibility but ignored securely
}) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Unauthorized" };

        const request = await prisma.request.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                priority: data.priority,
                submittedBy: currentUser.id, // Securely use current user
                status: 'PENDING'
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                userId: currentUser.id,
                action: `Submitted a ${data.type} request: ${data.title}`,
                points: 5,
                category: "REQUESTS"
            }
        });

        // Update user points
        await prisma.user.update({
            where: { id: currentUser.id },
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
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Unauthorized" };

        const request = await prisma.request.findUnique({ where: { id } });
        if (!request) return { success: false, error: "Request not found" };

        const isManager = currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR';
        const isOwner = request.submittedBy === currentUser.id;

        if (!isManager && !isOwner) {
            return { success: false, error: "You do not have permission to update this request." };
        }

        // Subscribers cannot change status
        if (!isManager && data.status && data.status !== request.status) {
            return { success: false, error: "You cannot change the status of a request." };
        }

        // Subscribers can only edit pending requests
        if (!isManager && request.status !== 'PENDING') {
            return { success: false, error: "You cannot edit a processed request." };
        }

        const updatedRequest = await prisma.request.update({
            where: { id },
            data
        });

        revalidatePath("/dashboard/requests");
        return { success: true, request: JSON.parse(JSON.stringify(updatedRequest)) };
    } catch (error) {
        console.error("Failed to update request:", error);
        return { success: false, error: "Failed to update request" };
    }
}

export async function deleteRequest(id: string) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Unauthorized" };

        const request = await prisma.request.findUnique({ where: { id } });
        if (!request) return { success: false, error: "Request not found" };

        const isManager = currentUser.role === 'ADMIN' || currentUser.role === 'EDITOR';
        const isOwner = request.submittedBy === currentUser.id;

        if (!isManager && !isOwner) {
            return { success: false, error: "You do not have permission to delete this request." };
        }

        // Subscribers can only delete pending requests (optional, but good practice)
        if (!isManager && request.status !== 'PENDING') {
            return { success: false, error: "You cannot delete a processed request." };
        }

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
