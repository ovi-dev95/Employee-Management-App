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

import { cookies } from "next/headers"

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("userId")?.value

        if (!userId) {
            console.warn("getCurrentUser: No session cookie found")
            return null
        }

        console.log("getCurrentUser: Fetching for ID", userId);
        const user = await prisma.user.findUnique({
            where: { id: userId }
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

        // Generate Invite Token
        const inviteToken = crypto.randomUUID();
        const inviteTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await prisma.user.create({
            data: {
                ...data,
                password: "setup-required",
                inviteToken,
                inviteTokenExpiry
            },
        });

        // Send Email
        const setupLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/setup-password?token=${inviteToken}`;

        const emailModule = await import("@/lib/email");
        const emailResult = await emailModule.sendEmail({
            to: user.email,
            subject: "Welcome to Razib Marketing - Set up your account",
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>Welcome, ${user.name}!</h1>
                    <p>You have been invited to join the Razib Marketing Employee Management Tool.</p>
                    <p>Please click the link below to set up your password and access your account:</p>
                    <a href="${setupLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Account</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 24 hours.</p>
                </div>
            `
        });

        if (!emailResult.success) {
            console.error("createUser: Failed to send email", emailResult.error);
            // Optional: Delete user if email fails so they can try again?
            // await prisma.user.delete({ where: { id: user.id } });
            // return { success: false, error: "User created but email failed: " + emailResult.error };
            return { success: true, user: JSON.parse(JSON.stringify(user)), warning: "User created, but email failed to send: " + emailResult.error };
        }

        revalidatePath("/dashboard/settings");
        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
    }
}

export async function getActivities(limit: number = 5, category?: string) {
    try {
        const activities = await prisma.activity.findMany({
            where: category ? { category } : {},
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
            },
            take: limit
        });
        return JSON.parse(JSON.stringify(activities));
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return [];
    }
}

export async function getLeaderboard(limit: number = 5) {
    try {
        const users = await prisma.user.findMany({
            orderBy: { points: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                points: true,
                role: true,
                avatar: true,
                department: true
            }
        });
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }
}
