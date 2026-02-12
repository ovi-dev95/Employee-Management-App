
import { Skeleton } from "@/components/ui/skeleton"

export default function AttendanceLoading() {
    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* List */}
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    )
}
