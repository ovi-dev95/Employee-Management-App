"use server"

import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay } from "date-fns"

export async function getDashboardStats() {
    try {
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const [totalEmployees, activeToday, pendingRequests, totalIdeas] = await Promise.all([
            prisma.user.count(),
            prisma.attendance.count({
                where: {
                    date: {
                        gte: start,
                        lte: end,
                    },
                    checkOut: null,
                }
            }),
            prisma.request.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma.idea.count()
        ]);

        return {
            totalEmployees: totalEmployees.toString(),
            activeToday: activeToday.toString(),
            pendingRequests: pendingRequests.toString(),
            totalIdeas: totalIdeas.toString()
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            totalEmployees: "0",
            activeToday: "0",
            pendingRequests: "0",
            totalIdeas: "0"
        };
    }
}
