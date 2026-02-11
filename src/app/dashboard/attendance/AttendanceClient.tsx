"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, BarChart3, UserCheck, UserX, AlertCircle, FileText, Download, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
// import { LookerEmbed } from '@/components/dashboard/looker-embed' // Commented out until component is verified
import { checkIn, checkOut } from '@/app/actions/attendance'
import { createRequest } from '@/app/actions/request'
import { toast } from 'sonner'
import { AttendanceTrendsChart } from '@/components/dashboard/attendance-trends-chart'

// Define types based on what we expect from Prism
type AttendanceRecord = {
    date: string
    checkIn: string
    checkOut: string | null
    duration: number | null
    status: string // Calculated on client or server
}

type UserProfile = {
    id: string
    name: string
    role: string
    // ... other fields
}

export default function AttendanceClient({
    user,
    myAttendance,
    teamAttendance
}: {
    user: any,
    myAttendance: any[],
    teamAttendance: any[]
}) {
    const [activeTab, setActiveTab] = useState('my-stats')
    const [loading, setLoading] = useState(false)
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'EDITOR'

    const handleCheckIn = async () => {
        setLoading(true)
        const res = await checkIn()
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            // In a real generic implementation we might update state locally or rely on router.refresh() 
            // but the server action calls revalidatePath, so router.refresh is handled implicitly by Next.js if we use it, 
            // or we might need to rely on the prop update if the parent re-renders. 
            // For now, let's just reload to be safe or wait for parent.
            window.location.reload()
        }
    }

    const handleCheckOut = async () => {
        setLoading(true)
        const res = await checkOut()
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            window.location.reload()
        }
    }

    // Calculate stats
    const presentDays = myAttendance.filter(a => a.checkIn).length
    // Start of month logic could be added here

    // Check if currently checked in
    const today = new Date().toDateString()
    const todaysRecord = myAttendance.find(a => new Date(a.date).toDateString() === today)
    const isCheckedIn = !!todaysRecord
    const isCheckedOut = !!todaysRecord?.checkOut

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Attendance & Leave</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track your work hours and manage leave requests.</p>
                </div>

                <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-xl border border-white/20 dark:border-white/10 shadow-sm">
                    <TabButton active={activeTab === 'my-stats'} onClick={() => setActiveTab('my-stats')} label="My Stats" />
                    {isAdmin && <TabButton active={activeTab === 'team-overview'} onClick={() => setActiveTab('team-overview')} label="Team Overview" />}
                    <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Analytics" />
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'my-stats' && (
                        <MyStatsView
                            data={myAttendance}
                            isCheckedIn={isCheckedIn}
                            isCheckedOut={isCheckedOut}
                            onCheckIn={handleCheckIn}
                            onCheckOut={handleCheckOut}
                            loading={loading}
                            user={user}
                        />
                    )}
                    {activeTab === 'team-overview' && <TeamOverview data={teamAttendance} />}
                    {activeTab === 'analytics' && <AnalyticsView />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                active
                    ? "bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
            )}
        >
            {label}
        </button>
    )
}

function MyStatsView({ data, isCheckedIn, isCheckedOut, onCheckIn, onCheckOut, loading, user }: any) {
    const handleRequestSubmit = async (formData: FormData) => {
        const type = formData.get("type") as string
        const from = formData.get("from") as string
        const to = formData.get("to") as string
        const reason = formData.get("reason") as string

        const res = await createRequest({
            title: `${type}`,
            description: `${reason} (From: ${from} To: ${to})`,
            type: 'LEAVE',
            priority: 'MEDIUM',
            submittedBy: user.id
        })

        if (res.error) alert(res.error)
        else alert("Request submitted successfully")
    }

    return (
        <div className="space-y-8">
            {/* Check-In/Out Action Area */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Today's Status</h2>
                        <p className="text-blue-100 max-w-md">
                            {isCheckedOut
                                ? "You have completed your work for today. Have a great evening!"
                                : isCheckedIn
                                    ? "You are currently checked in. Don't forget to check out!"
                                    : "Good morning! Please check in to mark your attendance."}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-sm font-medium bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                            <Clock className="w-4 h-4" />
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        {!isCheckedIn ? (
                            <button
                                onClick={onCheckIn}
                                disabled={loading}
                                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                {loading && <span className="animate-spin text-blue-600">⌛</span>}
                                Check In Now
                            </button>
                        ) : !isCheckedOut ? (
                            <button
                                onClick={onCheckOut}
                                disabled={loading}
                                className="px-8 py-4 bg-red-500/20 border border-red-200/20 hover:bg-red-500/30 text-white rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-sm"
                            >
                                {loading && <span className="animate-spin text-white">⌛</span>}
                                Check Out
                            </button>
                        ) : (
                            <div className="px-8 py-4 bg-white/20 text-white rounded-2xl font-bold border border-white/20 flex items-center gap-2 backdrop-blur-sm cursor-default">
                                <CheckCircle className="w-5 h-5" />
                                Completed
                            </div>
                        )}
                        <p className="text-xs text-blue-200 opacity-80">
                            Server Time: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Attendance List */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Recent History
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-4 font-semibold">Date</th>
                                    <th className="px-4 py-4 font-semibold">Check In</th>
                                    <th className="px-4 py-4 font-semibold">Check Out</th>
                                    <th className="px-4 py-4 font-semibold">Duration</th>
                                    <th className="px-4 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {data.map((row: any, i: number) => {
                                    const checkInTime = new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    const checkOutTime = row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
                                    const dateStr = new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

                                    return (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{dateStr}</td>
                                            <td className="px-4 py-4 text-slate-500">{checkInTime}</td>
                                            <td className="px-4 py-4 text-slate-500">{checkOutTime}</td>
                                            <td className="px-4 py-4 font-medium">{row.duration ? `${Math.floor(row.duration / 60)}h ${row.duration % 60}m` : '-'}</td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-xs font-bold",
                                                    row.checkOut ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                )}>
                                                    {row.checkOut ? 'Present' : 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">No attendance records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leave Request Widget */}
                <div className="glass-card rounded-2xl p-6 space-y-6 bg-white/40 dark:bg-slate-900/40">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        Request Leave
                    </h3>
                    <form action={handleRequestSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">Leave Type</label>
                            <select name="type" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Paid Vacation</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">From</label>
                                <input name="from" type="date" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">To</label>
                                <input name="to" type="date" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1.5">Reason</label>
                            <textarea name="reason" required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" placeholder="Brief explanation..." />
                        </div>
                        <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function TeamOverview({ data }: any) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center glass-card p-6 rounded-2xl">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Organization Overview</h2>
                    <p className="text-sm text-slate-500">Real-time attendance monitoring for all employees.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Status Today</th>
                            <th className="px-6 py-4">Check In</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No team data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                                                {row.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                                                <p className="text-xs text-slate-500">{row.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            {row.dept}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5",
                                            row.status.includes('Present') ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                row.status === 'Absent' ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                                                    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
                                                row.status.includes('Present') ? "bg-emerald-500" :
                                                    row.status === 'Absent' ? "bg-red-500" : "bg-blue-500"
                                            )} />
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{row.checkIn}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function AnalyticsView() {
    return (
        <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Trends</h3>
                        <p className="text-sm text-slate-500">Weekly check-in vs absent rate</p>
                    </div>
                    <select className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold outline-none">
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>
                <div className="h-[400px] w-full">
                    <AttendanceTrendsChart />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900 text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Avg. Work Hours</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">8.2h</p>
                </div>
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-center">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">On-Time Rate</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">94%</p>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900 text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Leave Utilization</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">12%</p>
                </div>
            </div>
        </div>
    )
}
