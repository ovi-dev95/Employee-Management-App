"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUsers() {
    try {
        console.log("Fetching users from database...");
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`Successfully fetched ${users.length} users.`);
        // Ensure data is serializable for Next.js Server Components/Actions
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function updateUser(id: string, data: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
}) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        revalidatePath("/dashboard/settings");
        return { success: true, user };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, error: "Failed to update user" };
    }
}

export async function deleteUser(id: string) {
    try {
        // In a real app, you might want to check permissions or dependencies
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function createUser(data: {
    name: string;
    email: string;
    role: string;
    department: string;
}) {
    try {
        const user = await prisma.user.create({
            data: {
                ...data,
                password: "scrypt-hash-placeholder", // Placeholder for now
            },
        });
        revalidatePath("/dashboard/settings");
        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, error: "Failed to create user" };
    }
}
