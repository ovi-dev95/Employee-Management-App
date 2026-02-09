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
}) {
    try {
        const settings = await prisma.systemSettings.upsert({
            where: { id: "global" },
            update: {
                ...data,
            },
            create: {
                id: "global",
                ...data,
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
