import { LookerEmbed } from '@/components/dashboard/looker-embed'
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics Center</h1>
                    <p className="text-slate-500 dark:text-slate-400">Advanced insights and team performance metrics via Looker Studio.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Data Sync
                </div>
            </header>

            {/* Main Embed */}
            <LookerEmbed
                title="Performance Overview"
                height="700px"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InsightCard
                    title="User Engagement"
                    value="+18.4%"
                    description="Increase in daily active employees using the portal compared to last month."
                    icon={Users}
                    trend="up"
                />
                <InsightCard
                    title="Avg. Productivity"
                    value="92%"
                    description="Current team-wide productivity score based on task completion and hours."
                    icon={TrendingUp}
                    trend="up"
                />
                <InsightCard
                    title="Latency / Uptime"
                    value="99.98%"
                    description="System stability and punch machine data sync reliability over the last 30 days."
                    icon={Clock}
                    trend="neutral"
                />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-amber-800 dark:text-amber-400">Data Synchronization Note</p>
                    <p className="text-amber-700 dark:text-amber-500">
                        Attendance data is synced with Looker Studio every 15 minutes. For immediate punch records,
                        please refer to the <a href="/dashboard/attendance" className="underline font-medium decoration-amber-500/30 hover:decoration-amber-500 transition-all">Attendance & Leave</a> page.
                    </p>
                </div>
            </div>
        </div>
    )
}

function InsightCard({ title, value, description, icon: Icon, trend }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{value}</span>
                {trend === 'up' && <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">↑</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    )
}
