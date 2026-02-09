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
        console.log(`Successfully fetched ${users.length} users. IDs: ${users.map(u => u.id).join(', ')}`);
        // Ensure data is serializable for Next.js Server Components/Actions
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function getCurrentUser() {
    try {
        console.log("getCurrentUser: Fetching for ovi@razibmarketing.net");
        // For now, fetching the Admin user by email as "current"
        const user = await prisma.user.findUnique({
            where: { email: "ovi@razibmarketing.net" }
        })
        if (!user) {
            console.error("getCurrentUser: User not found in database.");
        }
        return user ? JSON.parse(JSON.stringify(user)) : null
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        return null
    }
}

export async function updateUser(id: string, data: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    position?: string;
    avatar?: string;
    cover?: string;
}) {
    try {
        if (!id) throw new Error("User ID is required for update");
        console.log(`updateUser: Updating user ${id}`, Object.keys(data));
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/profile");
        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update user" };
    }
}

export async function deleteUser(id: string) {
    try {
        if (!id) throw new Error("User ID is required for deletion");
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
        console.log("createUser: Creating user", data.email);
        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return { success: false, error: "A user with this email already exists." };
        }

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
        return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
    }
}
