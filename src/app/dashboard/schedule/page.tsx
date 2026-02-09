"use client"

import { Calendar, Clock, Video, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SchedulePage() {
    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Schedule</h1>
                <p className="text-slate-500 dark:text-slate-400">Book 1:1s, Office Hours, or Zoom Rows.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Option 1: 1:1 Booking */}
                <BookingCard
                    title="1:1 with Admin"
                    description="Book a 30-min slot for personal feedback or blockers."
                    icon={Users}
                    color="bg-blue-500"
                    action="Book Slot"
                />

                {/* Option 2: Office Hours */}
                <BookingCard
                    title="Open Office Hours"
                    description="Drop in every Tuesday & Thursday from 2pm - 4pm."
                    icon={Clock}
                    color="bg-purple-500"
                    action="View Calendar"
                />

                {/* Option 3: Zoom Room */}
                <BookingCard
                    title="Team Zoom Room"
                    description="Instant collaboration space for cross-functional synced work."
                    icon={Video}
                    color="bg-pink-500"
                    action="Join Room"
                />
            </div>

            {/* Embedded Calendar Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Calendly / Amelia Embed</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        This area will load the 3rd-party scheduling iframe (e.g., Calendly) so team members can book directly without leaving the app.
                    </p>
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    Open External Calendar
                </button>
            </div>
        </div>
    )
}

function BookingCard({ title, description, icon: Icon, color, action }: any) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group"
        >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/20`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{description}</p>
            <button className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                {action}
            </button>
        </motion.div>
    )
}
