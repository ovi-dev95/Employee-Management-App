
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-4 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Chart Skeleton */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>

                {/* Request Status Chart Skeleton */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>

            <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
    )
}
