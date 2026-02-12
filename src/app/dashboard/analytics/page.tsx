import { getAnalyticsData } from '@/app/actions/analytics'
import AnalyticsClient from './components/AnalyticsClient'
import { getCurrentUser } from '@/app/actions/user'
import { ShieldAlert } from 'lucide-react'

export default async function AnalyticsPage() {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'EDITOR')) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
                    <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    This page is only accessible to Administrators and Editors. Please contact your system administrator if you believe this is an error.
                </p>
            </div>
        )
    }

    const data = await getAnalyticsData()

    return (
        <AnalyticsClient data={data} />
    )
}
