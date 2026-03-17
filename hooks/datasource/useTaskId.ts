'use client';
import { httpClient } from '@/lib/httpClient';
import { TArticle, TArticleCategory, TResponseMeta } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSort } from '../useSort';
import { useSyncUrl } from '../useSyncUrl';
import { buildUrl } from '@/lib/utils';
import { TTask } from './useTasks';

const useTaskId = (id: number) => {
  // const { order, sort } = useSort();
  // useSyncUrl({
  //   sortOrder: order.sortOrder,
  //   sortBy: sort.sortBy,
  // });
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      return httpClient.get<TTask>(
        buildUrl('/tasks/' + id),
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
    isLoading,
    refetch,
  };
};

export default useTaskId;
