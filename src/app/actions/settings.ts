"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/app/actions/user"

export async function updateSystemSettings(data: {
    lookerStudioUrl?: string;
    checkInTime?: string;
    checkOutTime?: string;
    sickLeaveDays?: number;
    paidLeaveDays?: number;
    yearlyLeaveDays?: number;
    yearlyLeaveDates?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    smtpFromEmail?: string;
    emailProvider?: string;
    brevoApiKey?: string;
    pointValues?: string;
}) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return { success: false, error: "Only Administrators can modify system settings." };
        }

        const settings = await prisma.systemSettings.upsert({
            where: { id: "global" },
            update: {
                ...data,
            },
            create: {
                id: "global",
                lookerStudioUrl: data.lookerStudioUrl,
                checkInTime: data.checkInTime || "12:00 PM",
                checkOutTime: data.checkOutTime || "08:00 PM",
                sickLeaveDays: data.sickLeaveDays || 10,
                paidLeaveDays: data.paidLeaveDays || 15,
                yearlyLeaveDays: data.yearlyLeaveDays || 20,
                yearlyLeaveDates: data.yearlyLeaveDates,
                smtpHost: data.smtpHost,
                smtpPort: data.smtpPort,
                smtpUser: data.smtpUser,
                smtpPassword: data.smtpPassword,
                smtpFromEmail: data.smtpFromEmail,
                emailProvider: data.emailProvider || "smtp",
                brevoApiKey: data.brevoApiKey,
                pointValues: data.pointValues || JSON.stringify({ login: 1, idea: 10, request: 5, sop: 20, checkIn: 1, checkOut: 1 })
            },
        });

        revalidatePath("/dashboard/settings");
        return { success: true, settings };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to save settings" };
    }
}

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "global" },
        });
        return settings;
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return null;
    }
}

export async function testEmailConfiguration(to: string) {
    try {
        const emailModule = await import("@/lib/email");
        const result = await emailModule.sendEmail({
            to,
            subject: "Test Email - Razib Marketing Employee Tool",
            html: `
                <div style="font-family: sans-serif; color: #333; padding: 20px;">
                    <h1>Config Test Successful!</h1>
                    <p>If you are reading this email, your email configuration is working correctly.</p>
                    <p><strong>Provider:</strong> ${process.env.EMAIL_PROVIDER || 'Check Settings'}</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                </div>
            `
        });
        return result;
    } catch (error) {
        console.error("Test email failed:", error);
        return { success: false, error: error instanceof Error ? error.message : "Test email failed" };
    }
}
