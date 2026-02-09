"use client"

import { useState, useEffect } from 'react'
import { Users, Clock, AlertCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AttendanceWidget } from '@/components/dashboard/attendance-widget'
import { LookerEmbed } from '@/components/dashboard/looker-embed'
import { getDashboardStats } from '@/app/actions/dashboard'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalEmployees: "0",
        activeToday: "0",
        pendingRequests: "0",
        totalIdeas: "0"
    })

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats()
            setStats(data)
        }
        fetchStats()
    }, [])

    return (
        <div className="p-8 space-y-8 h-full bg-slate-50 dark:bg-slate-950">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">The Pulse</h1>
                    <p className="text-slate-500 dark:text-slate-400">Live Analytics & Team Performance</p>
                </div>
                <div className="text-sm text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                    Updated: Just now
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    change="Active"
                    trend="up"
                    icon={Users}
                    color="text-blue-600"
                />
                <StatCard
                    title="Active Today"
                    value={stats.activeToday}
                    change="Punched In"
                    trend="up"
                    icon={Clock}
                    color="text-green-600"
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    change="Action Req."
                    trend="neutral"
                    icon={AlertCircle}
                    color="text-amber-600"
                />
                <StatCard
                    title="Total Ideas"
                    value={stats.totalIdeas}
                    change="Community"
                    trend="up"
                    icon={Lightbulb}
                    color="text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <LookerEmbed
                    title="Performance Overview"
                    className="lg:col-span-2"
                    height="400px"
                />

                <div className="space-y-6">
                    {/* Attendance Widget */}
                    <AttendanceWidget />

                    {/* Announcements / Recent Activity */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Announcements</h3>
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            <Announcement
                                title="New Brand Guidelines"
                                date="2h ago"
                                category="Design"
                                categoryColor="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                            />
                            <Announcement
                                title="Q2 Marketing Plan"
                                date="5h ago"
                                category="Strategy"
                                categoryColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            />
                            <Announcement
                                title="Server Maintenance"
                                date="1d ago"
                                category="DevOps"
                                categoryColor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            />
                        </div>

                        <h3 className="text-lg font-semibold my-4 text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-4">Your Tasks</h3>
                        <div className="space-y-3">
                            <TaskItem title="Review Homepage SEO" due="Today" />
                            <TaskItem title="Approve Social Media Assets" due="Tomorrow" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, trend, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg", color)}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                    trend === 'up' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    trend === 'down' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    trend === 'neutral' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                )}>
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    )
}

function Announcement({ title, date, category, categoryColor }: any) {
    return (
        <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-1">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", categoryColor)}>
                    {category}
                </span>
                <span className="text-xs text-slate-400">{date}</span>
            </div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
        </div>
    )
}

function TaskItem({ title, due }: any) {
    return (
        <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 cursor-pointer hover:border-blue-500 hover:bg-blue-500 transition-all" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
            </div>
            <span className="text-xs text-slate-400">{due}</span>
        </div>
    )
}
