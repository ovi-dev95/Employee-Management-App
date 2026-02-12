
"use client"

import { TrendingUp, Users, Clock, AlertCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function AnalyticsClient({ data }: any) {
    if (!data) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics Center</h1>
                    <p className="text-slate-500 dark:text-slate-400">Real-time insights on team performance and system usage.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Data
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InsightCard
                    title="Total Employees"
                    value={data?.totalUsers || 0}
                    description="Active users registered on the platform."
                    icon={Users}
                    trend="neutral"
                />
                <InsightCard
                    title="Avg. Attendance"
                    value="92%"
                    description="Weekly attendance rate across all departments."
                    icon={TrendingUp}
                    trend="up"
                />
                <InsightCard
                    title="System Uptime"
                    value="99.9%"
                    description="Biometric sync service availability."
                    icon={Clock}
                    trend="neutral"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Weekly Attendance
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.attendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                />
                                <Bar
                                    dataKey="users"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Request Status Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <PieChartIcon className="w-5 h-5 text-purple-500" />
                        Request Status
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.requests}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data?.requests.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-amber-800 dark:text-amber-400">Biometric Sync Active</p>
                    <p className="text-amber-700 dark:text-amber-500">
                        Attendance data is automatically updated from the ZKTeco machine every time a punch is recorded.
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
