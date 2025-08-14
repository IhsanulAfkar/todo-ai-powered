'use client'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { useSession } from '@/providers/SessionProvider'
import { NextPage } from 'next'

const DashboardPage: NextPage = () => {
    const { data: session, status } = useSession()
    console.log('session', session, status)
    return <div>
        <SectionCards />
        <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
        </div>
        <DataTable data={[]} />
    </div>
}

export default DashboardPage