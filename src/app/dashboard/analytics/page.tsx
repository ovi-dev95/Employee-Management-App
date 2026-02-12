import { getAnalyticsData } from '@/app/actions/analytics'
import AnalyticsClient from './components/AnalyticsClient'

export default async function AnalyticsPage() {
    const data = await getAnalyticsData()

    return (
        <AnalyticsClient data={data} />
    )
}
