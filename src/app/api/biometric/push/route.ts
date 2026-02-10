import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Expected payload from ZKTeco middleware
interface BiometricPayload {
    userId: string // Ensure this matches user.id in your DB (or email if you map it)
    timestamp: string // ISO string
    type: "IN" | "OUT"
    apiKey: string
}

export async function POST(request: Request) {
    try {
        const body: BiometricPayload = await request.json()

        // 1. Basic Security
        // In production, use a strong env var. For now, we use a default shared secret.
        const VALID_API_KEY = process.env.BIOMETRIC_API_KEY || "zkteco-secret-key-123"

        if (body.apiKey !== VALID_API_KEY) {
            return NextResponse.json({ success: false, error: "Invalid API Key" }, { status: 401 })
        }

        // 2. Find User
        // ZKTeco usually sends a numeric ID. You might need to map this to your UUID.
        // For this implementation, we assume the machine sends the User's Email or UUID directly.
        // If it sends a numeric ID, you'd look up the user by that specific field (e.g. employeeId).

        // Trying to find by ID first, then Email
        let user = await prisma.user.findUnique({ where: { id: body.userId } })
        if (!user) {
            user = await prisma.user.findUnique({ where: { email: body.userId } })
        }

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        // 3. Record Attendance
        const punchTime = new Date(body.timestamp)
        const date = new Date(punchTime.getFullYear(), punchTime.getMonth(), punchTime.getDate()) // Midnight today

        // Check if attendance record exists for this day
        // Note: This logic assumes one shift per day. ZKTeco might send multiple punches.
        // A robust system would log *raw* punches in a separate table and calculate attendance later.
        // For this "Simple" integration, we just update the daily record.

        // Find existing record for this user & day (ignoring time)
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        let attendance = await prisma.attendance.findFirst({
            where: {
                userId: user.id,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })

        if (!attendance) {
            // First punch of the day -> Create Check In
            if (body.type === 'IN') {
                attendance = await prisma.attendance.create({
                    data: {
                        userId: user.id,
                        date: date,
                        checkIn: punchTime,
                    }
                })
            } else {
                // Trying to punch out without punching in? 
                // Create record anyway with checkOut, checkIn as null (requires schema change) or same time
                // For safety in current schema (checkIn is default now), we just set checkIn = punchTime
                attendance = await prisma.attendance.create({
                    data: {
                        userId: user.id,
                        date: date,
                        checkIn: punchTime,
                        checkOut: punchTime // Immediate checkout
                    }
                })
            }
        } else {
            // Record exists
            if (body.type === 'OUT') {
                // Update Check Out
                await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: {
                        checkOut: punchTime,
                        // Calculate duration (in minutes/seconds if needed, but schema uses duration Int?)
                        // duration: ...
                    }
                })
            } else if (body.type === 'IN') {
                // Ignore multiple check-ins? Or update check-in to earliest?
                // Usually we keep the first check-in.
                // If existing check-in is vastly different, maybe logic needed.
                // We'll return success with "Already Checked In" info.
                return NextResponse.json({ success: true, message: "Attendance updated (Already Checked In)" })
            }
        }

        return NextResponse.json({ success: true, message: "Attendance recorded successfully", data: attendance })

    } catch (error) {
        console.error("Biometric Push Error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
