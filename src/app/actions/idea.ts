"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getIdeas() {
    try {
        const ideas = await prisma.idea.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                },
                votes: true,
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
        return JSON.parse(JSON.stringify(ideas));
    } catch (error) {
        console.error("Failed to fetch ideas:", error);
        return [];
    }
}

export async function createIdea(data: {
    title: string;
    description: string;
    submittedBy: string;
}) {
    try {
        const idea = await prisma.idea.create({
            data: {
                ...data,
                status: 'REVIEW',
                upvotes: 0
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                userId: data.submittedBy,
                action: `Submitted a new idea: ${data.title}`,
                points: 10,
                category: "PRODUCT_LAB"
            }
        });

        // Update user points
        await prisma.user.update({
            where: { id: data.submittedBy },
            data: { points: { increment: 10 } }
        });

        revalidatePath("/dashboard/product-lab");
        revalidatePath("/dashboard");
        return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
    } catch (error) {
        console.error("Failed to create idea:", error);
        return { success: false, error: "Failed to create idea" };
    }
}

export async function updateIdea(id: string, data: {
    title?: string;
    description?: string;
    status?: string;
}) {
    try {
        const idea = await prisma.idea.update({
            where: { id },
            data
        });
        revalidatePath("/dashboard/product-lab");
        return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
    } catch (error) {
        console.error("Failed to update idea:", error);
        return { success: false, error: "Failed to update idea" };
    }
}

export async function deleteIdea(id: string) {
    try {
        await prisma.idea.delete({
            where: { id }
        });
        revalidatePath("/dashboard/product-lab");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete idea:", error);
        return { success: false, error: "Failed to delete idea" };
    }
}

export async function toggleIdeaLike(ideaId: string, userId: string) {
    try {
        const existingVote = await prisma.vote.findUnique({
            where: { userId_ideaId: { userId, ideaId } }
        });

        const existingDislike = await prisma.ideaDislike.findUnique({
            where: { userId_ideaId: { userId, ideaId } }
        });

        // Remove dislike if exists
        if (existingDislike) {
            await prisma.ideaDislike.delete({ where: { id: existingDislike.id } });
        }

        if (existingVote) {
            await prisma.vote.delete({ where: { id: existingVote.id } });
            await prisma.idea.update({
                where: { id: ideaId },
                data: { upvotes: { decrement: 1 } }
            });
        } else {
            await prisma.vote.create({ data: { userId, ideaId } });
            await prisma.idea.update({
                where: { id: ideaId },
                data: { upvotes: { increment: 1 } }
            });
        }

        revalidatePath("/dashboard/product-lab");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle idea like:", error);
        return { success: false, error: "Failed to toggle like" };
    }
}
export const toggleVote = toggleIdeaLike; // Alias for backward compatibility

export async function toggleIdeaDislike(ideaId: string, userId: string) {
    try {
        const existingDislike = await prisma.ideaDislike.findUnique({
            where: { userId_ideaId: { userId, ideaId } }
        });

        const existingVote = await prisma.vote.findUnique({
            where: { userId_ideaId: { userId, ideaId } }
        });

        // Remove like (vote) if exists
        if (existingVote) {
            await prisma.vote.delete({ where: { id: existingVote.id } });
            await prisma.idea.update({
                where: { id: ideaId },
                data: { upvotes: { decrement: 1 } }
            });
        }

        if (existingDislike) {
            await prisma.ideaDislike.delete({ where: { id: existingDislike.id } });
        } else {
            await prisma.ideaDislike.create({ data: { userId, ideaId } });
        }

        revalidatePath("/dashboard/product-lab");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle idea dislike:", error);
        return { success: false, error: "Failed to toggle dislike" };
    }
}
