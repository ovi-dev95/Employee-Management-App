import { Users, Clock, AlertCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AttendanceWidget } from '@/components/dashboard/attendance-widget'
import { LookerEmbed } from '@/components/dashboard/looker-embed'
import { getDashboardStats } from '@/app/actions/dashboard'
import { getMyAttendance } from '@/app/actions/attendance'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const myAttendance = await getMyAttendance()

    // Determine today's attendance status
    const today = new Date().toDateString()
    const todaysRecord = myAttendance.find((a: any) => new Date(a.date).toDateString() === today)
    const isCheckedIn = !!todaysRecord && !todaysRecord.checkOut
    const checkInTime = todaysRecord ? todaysRecord.checkIn : null

    return (


    return (
        <div className="p-8 space-y-8 h-full">
            <header className="flex justify-between items-center animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">The Pulse</h1>
                    <p className="text-slate-500 dark:text-slate-400">Live Analytics & Team Performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                        Updated: {new Date().toLocaleTimeString()}
                    </div>
                    <ModeToggle />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    change="Active"
                    trend="up"
                    icon={Users}
                    color="text-blue-600"
                    gradient="from-blue-500/10 to-blue-500/5"
                />
                <StatCard
                    title="Active Today"
                    value={stats.activeToday}
                    change="Punched In"
                    trend="up"
                    icon={Clock}
                    color="text-emerald-600"
                    gradient="from-emerald-500/10 to-emerald-500/5"
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    change="Action Req."
                    trend={parseInt(stats.pendingRequests) > 0 ? "down" : "neutral"}
                    icon={AlertCircle}
                    color="text-amber-600"
                    gradient="from-amber-500/10 to-amber-500/5"
                />
                <StatCard
                    title="Total Ideas"
                    value={stats.totalIdeas}
                    change="Community"
                    trend="up"
                    icon={Lightbulb}
                    color="text-purple-600"
                    gradient="from-purple-500/10 to-purple-500/5"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden p-1">
                    <LookerEmbed
                        title="Performance Overview"
                        height="400px"
                    />
                </div>

                <div className="space-y-6">
                    {/* Attendance Widget */}
                    <AttendanceWidget isCheckedIn={isCheckedIn} checkInTime={checkInTime} />

                    {/* Announcements / Recent Activity */}
                    <div className="glass-card rounded-2xl p-6 flex flex-col">
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

function StatCard({ title, value, change, trend, icon: Icon, color, gradient }: any) {
    return (
        <div className={cn("glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform", gradient && `bg-gradient-to-br ${gradient}`)}>
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm", color)}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent",
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
