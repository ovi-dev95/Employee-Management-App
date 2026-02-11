import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LeaderboardWidget({ users }: { users: any[] }) {
    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard
            </h3>
            <div className="space-y-4">
                {users.map((user, i) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                i === 0 ? "bg-amber-100 text-amber-700" :
                                    i === 1 ? "bg-slate-200 text-slate-700" :
                                        i === 2 ? "bg-amber-700/10 text-amber-800" : "bg-slate-50 text-slate-500"
                            )}>
                                {i + 1}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600">
                                {user.name?.[0] || '?'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{user.department}</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{user.points} pts</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
