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


export async function getLeaveStats(userId?: string) {
    try {
        const settings = await prisma.systemSettings.findUnique({ where: { id: "global" } });
        const total = (settings?.sickLeaveDays || 0) + (settings?.paidLeaveDays || 0) + (settings?.yearlyLeaveDays || 0);

        // In a real app, query 'Request' table for approved 'LEAVE' type requests
        // mocking for now as User requested visual only first
        return {
            total: total || 45,
            taken: 5,
            remaining: (total || 45) - 5
        };
    } catch (error) {
        return {
            total: 0,
            taken: 0,
            remaining: 0
        };
    }
}
