import { getCurrentUser } from "@/app/actions/user"
import { getMyAttendance, getTeamAttendance } from "@/app/actions/attendance"
import AttendanceClient from "./AttendanceClient"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AttendancePage() {
    const user = await getCurrentUser()

    // Fallback if middleware fails or direct access
    if (!user) {
        redirect("/login")
    }

    const [myAttendance, teamAttendance] = await Promise.all([
        getMyAttendance(),
        getTeamAttendance()
    ])

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <AttendanceClient
                user={user}
                myAttendance={myAttendance}
                teamAttendance={teamAttendance}
            />
        </div>
    )
}
