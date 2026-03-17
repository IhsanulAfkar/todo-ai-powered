'use client';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useDashboard from '@/hooks/datasource/useDashboard';
import { getSession } from '@/lib/getSession';
import { useHeaderTitle } from '@/providers/HeaderTitleProvider';
import { useSession } from '@/providers/SessionProvider';
import { NextPage } from 'next';
import { useEffect } from 'react';
import TaskCard from './taks/TaskCard';
import TaskFetchId from './taks/TaskFetchId';
import { CircularChart } from '@/components/ui/custom/circular-chart';

const DashboardPage: NextPage = () => {
  useHeaderTitle('Dashboard');
  const { data: session } = useSession()
  const { data, isLoading } = useDashboard()
  return (
    <div className="flex flex-col gap-4 lg:px-8 px-4">
      <p className='font-semibold text-2xl'>Welcome back, {session?.user.name}</p>
      <div className='flex flex-col-reverse lg:flex-row gap-6 w-full mt-8'>
        <Card className='w-full max-w-lg'>
          <CardHeader><CardTitle>Today Tasks</CardTitle></CardHeader>
          <CardContent>
            <div className='max-h-[70vh] overflow-y-auto overflow-x-hidden space-y-4' >
              {data?.unfinished_today_tasks.map(task => <TaskFetchId key={task.id} task_id={task.id}>
                <TaskCard task={task} />
              </TaskFetchId>)}
            </div>
          </CardContent>
        </Card>
        <div className='flex-1 space-y-6'>
          <Card>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="md:basis-1/2 md:pr-4 md:border-r">
                <p className="font-semibold text-lg text-center">Status</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <CircularChart
                    color="#05a301"
                    label="Completed"
                    value={data?.status.find(p => p.status === "Completed")?.percentage ?? 0}
                  />
                  <CircularChart
                    color="#0224ff"
                    label="Ongoing"
                    value={data?.status.find(p => p.status === "Ongoing")?.percentage ?? 0}
                  />
                  <CircularChart
                    color="#f21e1e"
                    label="Pending"
                    value={data?.status.find(p => p.status === "Pending")?.percentage ?? 0}
                  />
                </div>
              </div>

              <div className="md:basis-1/2 md:pl-4">
                <p className="font-semibold text-lg text-center">Priority</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <CircularChart
                    color="#008235"
                    label="Low"
                    value={data?.priority.find(p => p.priority === "Low")?.percentage ?? 0}
                  />
                  <CircularChart
                    color="#a65f00"
                    label="Medium"
                    value={data?.priority.find(p => p.priority === "Medium")?.percentage ?? 0}
                  />
                  <CircularChart
                    color="#ca3500"
                    label="High"
                    value={data?.priority.find(p => p.priority === "High")?.percentage ?? 0}
                  />
                  <CircularChart
                    color="#c10007"
                    label="Urgent"
                    value={data?.priority.find(p => p.priority === "Urgent")?.percentage ?? 0}
                  />

                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent></CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
