
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto">
            <header className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-[400px] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-[150px] w-full rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
