"use client"

import { useState, useEffect } from 'react'
import { Clock, LogIn, LogOut, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function AttendanceWidget() {
    const [status, setStatus] = useState<'out' | 'in' | 'break'>('out')
    const [checkInTime, setCheckInTime] = useState<Date | null>(null)
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (status === 'in' && checkInTime) {
            interval = setInterval(() => {
                setElapsed(Math.floor((new Date().getTime() - checkInTime.getTime()) / 1000))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [status, checkInTime])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleAction = (newStatus: 'in' | 'out' | 'break') => {
        if (newStatus === 'in') {
            setCheckInTime(new Date())
        } else if (newStatus === 'out') {
            setCheckInTime(null)
            setElapsed(0)
        }
        setStatus(newStatus)
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance</h3>
                <p className="text-sm text-slate-500">{format(new Date(), 'EEEE, MMMM do')}</p>
            </div>

            <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">
                {status === 'in' ? formatTime(elapsed) : '--:--:--'}
            </div>

            <div className="flex gap-3 w-full">
                {status === 'out' ? (
                    <button
                        onClick={() => handleAction('in')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                    >
                        <LogIn className="w-5 h-5" /> Check In
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => handleAction('out')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" /> Clock Out
                        </button>
                        {/* Break functionality disabled for simplicity in this version, or can be added */}
                    </>
                )}
            </div>

            <div className="text-xs text-slate-400 text-center">
                {status === 'in'
                    ? `Check-in time: ${checkInTime ? format(checkInTime, 'h:mm aa') : ''}`
                    : 'You are currently clocked out'}
            </div>
        </div>
    )
}
