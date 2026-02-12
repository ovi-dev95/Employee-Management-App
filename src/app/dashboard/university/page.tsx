
import { getSOPs } from '@/app/actions/sop'
import { getCurrentUser } from '@/app/actions/user'
import UniversityClient from './client'

export default async function UniversityPage() {
    const [sops, user] = await Promise.all([
        getSOPs(),
        getCurrentUser()
    ])

    return <UniversityClient initialSops={sops} user={user} />
}
