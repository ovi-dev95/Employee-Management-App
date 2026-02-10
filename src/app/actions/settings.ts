"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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
}) {
    try {
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
                brevoApiKey: data.brevoApiKey
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
