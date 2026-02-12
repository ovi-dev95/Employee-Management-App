"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSOPs() {
    try {
        const sops = await prisma.sOP.findMany({
            include: {
                likes: true,
                dislikes: true,
                comments: {
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
                }
            },
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
    docUrl?: string;
    featureImage?: string;
    content: string;
    userId?: string; // Optional for logging
}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId, ...sopData } = data;

        const sop = await prisma.sOP.create({
            data: {
                ...sopData,
                views: 0
            }
        });

        if (data.userId) {
            await prisma.activity.create({
                data: {
                    userId: data.userId,
                    action: `Created new SOP: ${data.title}`,
                    points: 5,
                    category: "UNIVERSITY"
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
    docUrl?: string;
    featureImage?: string;
    content?: string;
    userId?: string;
}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId, ...sopUpdateData } = data;

        const sop = await prisma.sOP.update({
            where: { id },
            data: sopUpdateData
        });

        if (data.userId) {
            await prisma.activity.create({
                data: {
                    userId: data.userId,
                    action: `Updated SOP: ${sop.title}`,
                    points: 2,
                    category: "UNIVERSITY"
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

// Simplified revalidate
export async function deleteSOP(id: string) {
    try {
        await prisma.sOP.delete({ where: { id } });
        revalidatePath("/dashboard/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete SOP:", error);
        return { success: false, error: "Failed to delete SOP" };
    }
}

export async function toggleSOPLike(sopId: string, userId: string) {
    try {
        const existingLike = await prisma.sOPLike.findUnique({
            where: { userId_sopId: { userId, sopId } }
        });

        const existingDislike = await prisma.sOPDislike.findUnique({
            where: { userId_sopId: { userId, sopId } }
        });

        // Remove dislike if exists
        if (existingDislike) {
            await prisma.sOPDislike.delete({ where: { id: existingDislike.id } });
        }

        if (existingLike) {
            await prisma.sOPLike.delete({ where: { id: existingLike.id } });
        } else {
            await prisma.sOPLike.create({ data: { userId, sopId } });
        }

        revalidatePath("/dashboard/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle SOP like:", error);
        return { success: false, error: "Failed to toggle like" };
    }
}

export async function toggleSOPDislike(sopId: string, userId: string) {
    try {
        const existingDislike = await prisma.sOPDislike.findUnique({
            where: { userId_sopId: { userId, sopId } }
        });

        const existingLike = await prisma.sOPLike.findUnique({
            where: { userId_sopId: { userId, sopId } }
        });

        // Remove like if exists
        if (existingLike) {
            await prisma.sOPLike.delete({ where: { id: existingLike.id } });
        }

        if (existingDislike) {
            await prisma.sOPDislike.delete({ where: { id: existingDislike.id } });
        } else {
            await prisma.sOPDislike.create({ data: { userId, sopId } });
        }

        revalidatePath("/dashboard/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle SOP dislike:", error);
        return { success: false, error: "Failed to toggle dislike" };
    }
}


