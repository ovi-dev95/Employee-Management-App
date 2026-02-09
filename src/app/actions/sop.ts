"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSOPs() {
    try {
        const sops = await prisma.sOP.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return JSON.parse(JSON.stringify(sops));
    } catch (error) {
        console.error("Failed to fetch SOPs:", error);
        return [];
    }
}

export async function createSOP(data: {
    title: string;
    category: string;
    videoUrl?: string;
    content: string;
    userId?: string; // Optional for logging
}) {
    try {
        const sop = await prisma.sOP.create({
            data: {
                ...data,
                views: 0
            }
        });

        if (data.userId) {
            await prisma.activity.create({
                data: {
                    userId: data.userId,
                    action: `Created new SOP: ${data.title}`,
                    points: 5
                }
            });
            await prisma.user.update({
                where: { id: data.userId },
                data: { points: { increment: 5 } }
            });
        }

        revalidatePath("/dashboard/university");
        return { success: true, sop: JSON.parse(JSON.stringify(sop)) };
    } catch (error) {
        console.error("Failed to create SOP:", error);
        return { success: false, error: "Failed to create SOP" };
    }
}

export async function updateSOP(id: string, data: {
    title?: string;
    category?: string;
    videoUrl?: string;
    content?: string;
    userId?: string;
}) {
    try {
        const sop = await prisma.sOP.update({
            where: { id },
            data
        });

        if (data.userId) {
            await prisma.activity.create({
                data: {
                    userId: data.userId,
                    action: `Updated SOP: ${sop.title}`,
                    points: 2
                }
            });
        }

        revalidatePath("/dashboard/university");
        return { success: true, sop: JSON.parse(JSON.stringify(sop)) };
    } catch (error) {
        console.error("Failed to update SOP:", error);
        return { success: false, error: "Failed to update SOP" };
    }
}

export async function incrementSOPViews(id: string) {
    try {
        await prisma.sOP.update({
            where: { id },
            data: { views: { increment: 1 } }
        });
        revalidatePath("/dashboard/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to increment views:", error);
        return { success: false };
    }
}

export async function deleteSOP(id: string) {
    try {
        await prisma.sOP.delete({
            where: { id }
        });
        revalidatePath("/dashboard/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete SOP:", error);
        return { success: false, error: "Failed to delete SOP" };
    }
}
