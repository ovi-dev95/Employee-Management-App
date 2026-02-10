"use server"

import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, subDays, format } from "date-fns"

export async function getAnalyticsData() {
    try {
        const today = new Date()
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(today, 6 - i)
            return {
                date: format(d, 'EEE'), // Mon, Tue...
                fullDate: d,
                attendance: 0
            }
        })

        // 1. Attendance Last 7 Days
        const recentAttendance = await prisma.attendance.groupBy({
            by: ['date'],
            where: {
                date: {
                    gte: subDays(startOfDay(today), 6)
                }
            },
            _count: {
                id: true
            }
        })

        // Merge with last7Days structure to ensure 0s are filled
        // Note: Prisma groupBy date returns Date object. match by day string.
        const attendanceMap = new Map()
        recentAttendance.forEach(item => {
            attendanceMap.set(format(new Date(item.date), 'EEE'), item._count.id)
        })

        const attendanceChartData = last7Days.map(day => ({
            name: day.date,
            users: attendanceMap.get(day.date) || 0
        }))

        // 2. Request Status Breakdown
        const requestStats = await prisma.request.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        })

        const requestChartData = [
            { name: 'Pending', value: 0, color: '#fbbf24' }, // Amber
            { name: 'Approved', value: 0, color: '#22c55e' }, // Green
            { name: 'Rejected', value: 0, color: '#ef4444' } // Red
        ]

        requestStats.forEach(stat => {
            if (stat.status === 'PENDING') requestChartData[0].value = stat._count.id
            if (stat.status === 'APPROVED' || stat.status === 'COMPLETED') requestChartData[1].value += stat._count.id // Group Completed with Approved
            if (stat.status === 'REJECTED') requestChartData[2].value = stat._count.id
        })

        // 3. User Growth (Total Users)
        const totalUsers = await prisma.user.count()

        return {
            attendance: attendanceChartData,
            requests: requestChartData,
            totalUsers
        }

    } catch (error) {
        console.error("Failed to fetch analytics:", error)
        return {
            attendance: [],
            requests: [],
            totalUsers: 0
        }
    }
}
