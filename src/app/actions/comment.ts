"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addComment(data: {
    entityId: string;
    entityType: 'SOP' | 'IDEA';
    content: string;
    userId: string;
}) {
    try {
        const commentData: any = {
            content: data.content,
            userId: data.userId,
        };

        if (data.entityType === 'SOP') commentData.sopId = data.entityId;
        if (data.entityType === 'IDEA') commentData.ideaId = data.entityId;

        const comment = await prisma.comment.create({
            data: commentData,
            include: { user: { select: { name: true, avatar: true } } }
        });

        // Add activity log? Maybe later if needed.

        revalidatePath("/dashboard/university");
        revalidatePath("/dashboard/product-lab");

        return { success: true, comment: JSON.parse(JSON.stringify(comment)) };
    } catch (error) {
        console.error("Failed to add comment:", error);
        return { success: false, error: "Failed to add comment" };
    }
}

export async function deleteComment(commentId: string, userId: string) {
    try {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) return { success: false, error: "Comment not found" };

        if (comment.userId !== userId) {
            // Check if admin? For now only owner deletes.
            return { success: false, error: "Unauthorized" };
        }

        await prisma.comment.delete({ where: { id: commentId } });

        revalidatePath("/dashboard/university");
        revalidatePath("/dashboard/product-lab");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete comment:", error);
        return { success: false, error: "Failed to delete comment" };
    }
}
