"use client"

import { useState, useEffect } from 'react'
import { getActivities } from '@/app/actions/user'
import { Clock, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function ActivityLog({ limit = 5, category, className }: { limit?: number; category?: string; className?: string }) {
    const [activities, setActivities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            const data = await getActivities(limit, category)
            setActivities(data)
            setIsLoading(false)
        }
        fetchActivities()
    }, [limit, category])

    if (isLoading) {
        return (
            <div className={cn("space-y-4 animate-pulse", className)}>
                {Array(limit).fill(0).map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                ))}
            </div>
        )
    }

    if (activities.length === 0) {
        return (
            <div className={cn("text-center py-8 text-slate-500 text-sm", className)}>
                No recent activity
            </div>
        )
    }

    return (
        <div className={cn("space-y-4", className)}>
            {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start group">
                    <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        {activity.user?.avatar ? (
                            <img src={activity.user.avatar} alt={activity.user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <UserIcon className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
                            <span className="font-bold">{activity.user?.name || 'Unknown'}</span> {activity.action}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            {activity.points > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold">
                                    +{activity.points} pts
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
