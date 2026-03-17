'use client';
import { httpClient } from '@/lib/httpClient';
import { TArticle, TArticleCategory, TResponseMeta } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSort } from '../useSort';
import { useSyncUrl } from '../useSyncUrl';
import { buildUrl } from '@/lib/utils';
import { TTask } from './useTasks';
export type TPriorityPercentage = {
  priority: string;
  count: number;
  percentage: number;
}
export type TStatusPercentage = {
  status: string;
  count: number;
  percentage: number;
}
const useDashboard = () => {

  const {
    data: response,
    error,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      return httpClient.get<{
        unfinished_today_tasks: TTask[],
        priority: TPriorityPercentage[],
        status: TStatusPercentage[]
      }>(
        buildUrl('/dashboard'),
      );
    },
  });
  if (error) {
    console.log(error);
    toast.error('Server Error');
  }
  return {
    data: response?.data,
    status: response?.status,
    error,
    isLoading: isLoading || isRefetching,
    refetch,
  };
};

export default useDashboard;
