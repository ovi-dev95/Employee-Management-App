"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, BarChart3, UserCheck, UserX, AlertCircle, FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LookerEmbed } from '@/components/dashboard/looker-embed'

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState('my-stats')
    // In a real app, we would check the user role here
    const [isAdmin, setIsAdmin] = useState(true)

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Attendance & Leave</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your work hours, leave balance, and performance.</p>
                </div>
                {isAdmin && (
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('my-stats')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === 'my-stats' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            My Stats
                        </button>
                        <button
                            onClick={() => setActiveTab('team-overview')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === 'team-overview' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            Team Overview (Admin)
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === 'analytics' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            Looker Studio
                        </button>
                    </div>
                )}
            </header>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'my-stats' && <MyStatsView />}
                {activeTab === 'team-overview' && <TeamOverview />}
                {activeTab === 'analytics' && <LookerStudioEmbed />}
            </motion.div>
        </div>
    )
}

function MyStatsView() {
    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Present Days" value="18" total="/ 22" icon={UserCheck} color="text-emerald-500 bg-emerald-500/10" />
                <StatCard title="Absent" value="1" total="Day" icon={UserX} color="text-red-500 bg-red-500/10" />
                <StatCard title="Late Arrivals" value="3" total="Days" icon={AlertCircle} color="text-amber-500 bg-amber-500/10" />
                <StatCard title="Leave Balance" value="12" total="Remaining" icon={Calendar} color="text-blue-500 bg-blue-500/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Attendance List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Attendance History (Feb 2026)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Check In</th>
                                    <th className="px-4 py-3">Check Out</th>
                                    <th className="px-4 py-3 rounded-r-lg">Total Hrs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[
                                    { date: 'Feb 09', status: 'Present', in: '09:02 AM', out: 'Running', hrs: '-' },
                                    { date: 'Feb 08', status: 'Present', in: '08:55 AM', out: '06:10 PM', hrs: '9h 15m' },
                                    { date: 'Feb 07', status: 'Late', in: '09:45 AM', out: '06:30 PM', hrs: '8h 45m' },
                                    { date: 'Feb 06', status: 'Present', in: '09:00 AM', out: '06:00 PM', hrs: '9h 00m' },
                                    { date: 'Feb 05', status: 'Absent', in: '-', out: '-', hrs: '-' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-bold",
                                                row.status === 'Present' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                                                row.status === 'Late' && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                                                row.status === 'Absent' && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.in}</td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.out}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.hrs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leave Request Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Leave</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Leave Type</label>
                            <select className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm">
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Paid Vacation</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">From</label>
                                <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">To</label>
                                <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Reason</label>
                            <textarea rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" placeholder="Brief explanation..." />
                        </div>
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors">
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamOverview() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Organization Overview</h2>
                    <p className="text-sm text-slate-500">Real-time attendance monitoring for all employees.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Status Today</th>
                            <th className="px-6 py-4">Check In</th>
                            <th className="px-6 py-4">Avg. Hours</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                            { name: 'Md Atiar Rahman Ovi', role: 'Junior Manager', dept: 'WEB', status: 'Present', in: '09:02 AM', avg: '9.2h' },
                            { name: 'Sarah Khan', role: 'SEO Specialist', dept: 'SEO', status: 'Present', in: '08:55 AM', avg: '8.8h' },
                            { name: 'Mike Ross', role: 'Designer', dept: 'UI/UX', status: 'Late', in: '10:15 AM', avg: '8.5h' },
                            { name: 'Jessica Blue', role: 'Developer', dept: 'WEB', status: 'Absent', in: '-', avg: '9.0h' },
                            { name: 'Tom Green', role: 'Media Buyer', dept: 'PAID MEDIA', status: 'On Leave', in: '-', avg: '8.9h' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500">
                                            {row.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{row.name}</p>
                                            <p className="text-xs text-slate-500">{row.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                        {row.dept}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1",
                                        row.status === 'Present' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                                        row.status === 'Late' && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                                        row.status === 'Absent' && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                                        row.status === 'On Leave' && "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full",
                                            row.status === 'Present' ? "bg-emerald-500" :
                                                row.status === 'Late' ? "bg-amber-500" :
                                                    row.status === 'Absent' ? "bg-red-500" : "bg-blue-500"
                                        )} />
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{row.in}</td>
                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{row.avg}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function LookerStudioEmbed() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Organization Analytics</h2>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Powered by Looker Studio
                </span>
            </div>

            <LookerEmbed
                title="Attendance & Leave Report"
                height="600px"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Detailed Monthly Report</h4>
                    <p className="text-xs text-slate-500 mb-4">Comprehensive breakdown of all employee activities.</p>
                    <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Open Full Report</button>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Leave Analysis</h4>
                    <p className="text-xs text-slate-500 mb-4">Trends on sick leaves and vacations per department.</p>
                    <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">View Analysis</button>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">Export Data</h4>
                    <p className="text-xs text-slate-500 mb-4">Download raw data for external processing in Excel.</p>
                    <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Export CSV</button>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, total, icon: Icon, color }: any) {
    return (
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
                    <span className="text-sm font-medium text-slate-400">{total}</span>
                </div>
            </div>
            <div className={cn("absolute top-4 right-4 p-3 rounded-xl opacity-80", color)}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    )
}
