'use client';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { getSession } from '@/lib/getSession';
import { useHeaderTitle } from '@/providers/HeaderTitleProvider';
import { useSession } from '@/providers/SessionProvider';
import { NextPage } from 'next';
import { useEffect } from 'react';

const DashboardPage: NextPage = () => {
  useHeaderTitle('Dashboard');
  const { data: session, status } = useSession();
  return (
    <div className="flex flex-col gap-4">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={[]} />
    </div>
  );
};

export default DashboardPage;
