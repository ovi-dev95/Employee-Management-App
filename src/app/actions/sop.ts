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
}) {
    try {
        const sop = await prisma.sOP.create({
            data: {
                ...data,
                views: 0
            }
        });
        revalidatePath("/dashboard/university");
        return { success: true, sop: JSON.parse(JSON.stringify(sop)) };
    } catch (error) {
        console.error("Failed to create SOP:", error);
        return { success: false, error: "Failed to create SOP" };
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
