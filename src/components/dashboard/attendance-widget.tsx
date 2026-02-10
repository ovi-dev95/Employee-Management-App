"use client"

import { useState, useEffect } from 'react'
import { LogIn, LogOut, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { checkIn, checkOut } from '@/app/actions/attendance'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AttendanceWidgetProps {
    isCheckedIn: boolean
    checkInTime: string | null // ISO string
}

export function AttendanceWidget({ isCheckedIn: initialStatus, checkInTime: initialTime }: AttendanceWidgetProps) {
    const [isCheckedIn, setIsCheckedIn] = useState(initialStatus)
    const [checkInTime, setCheckInTime] = useState<Date | null>(initialTime ? new Date(initialTime) : null)
    const [elapsed, setElapsed] = useState(0)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isCheckedIn && checkInTime) {
            // Update elapsed time immediately to avoid 1s delay
            setElapsed(Math.floor((new Date().getTime() - checkInTime.getTime()) / 1000))

            interval = setInterval(() => {
                setElapsed(Math.floor((new Date().getTime() - checkInTime.getTime()) / 1000))
            }, 1000)
        } else {
            setElapsed(0)
        }
        return () => clearInterval(interval)
    }, [isCheckedIn, checkInTime])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleCheckIn = async () => {
        setLoading(true)
        try {
            const res = await checkIn()
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Checked in successfully!")
                setIsCheckedIn(true)
                setCheckInTime(new Date())
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to check in")
        } finally {
            setLoading(false)
        }
    }

    const handleCheckOut = async () => {
        setLoading(true)
        try {
            const res = await checkOut()
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Checked out successfully!")
                setIsCheckedIn(false)
                setCheckInTime(null)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to check out")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance</h3>
                <p className="text-sm text-slate-500">{format(new Date(), 'EEEE, MMMM do')}</p>
            </div>

            <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-widest tabular-nums">
                {isCheckedIn ? formatTime(elapsed) : '--:--:--'}
            </div>

            <div className="flex gap-3 w-full">
                {!isCheckedIn ? (
                    <button
                        onClick={handleCheckIn}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                        Check In
                    </button>
                ) : (
                    <button
                        onClick={handleCheckOut}
                        disabled={loading}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />}
                        Check Out
                    </button>
                )}
            </div>

            <div className="text-xs text-slate-400 text-center">
                {isCheckedIn
                    ? `Started at: ${checkInTime ? format(checkInTime, 'h:mm aa') : ''}`
                    : 'Ready to start your day?'}
            </div>
        </div>
    )
}
