import { Sidebar } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 relative">
                <div className="absolute top-4 right-4 z-50">
                    <ModeToggle />
                </div>
                {children}
            </main>
        </div>
    )
}
