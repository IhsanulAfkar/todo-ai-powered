'use client';
import { httpClient } from '@/lib/httpClient';
import { TArticle, TArticleCategory, TResponseMeta } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSort } from '../useSort';
import { useSyncUrl } from '../useSyncUrl';
import { buildUrl } from '@/lib/utils';
import { useSession } from '@/providers/SessionProvider';
export type TTaskImage = {
  "id": number,
  "task_id": number,
  "file_path": string,
  "is_thumbnail": boolean,
  "created_at": string
}
export type TTask = {
  "id": number,
  "title": string,
  "date": string,
  "priority": string,
  "content": string,
  "status": string,
  "user_id": number,
  "created_at": string,
  "updated_at": string,
  "images": TTaskImage[]
}
const useTasks = () => {
  const { order, sort } = useSort();
  useSyncUrl({
    sortOrder: order.sortOrder,
    sortBy: sort.sortBy,
  });
  const {
    data: response,
    error,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['tasks', order.sortOrder, sort.sortBy],
    queryFn: async () => {
      return httpClient.get<TTask[]>(
        buildUrl('/tasks', {
          orderBy: sort.sortBy,
          order: order.sortOrder,
        }),
      );
    },
  });
  if (error) {
    console.log(error);
    toast.error('Server Error');
  }
  return {
    data: response?.data ?? [],
    status: response?.status,
    filter: {
      sort,
      order,
    },
    error,
    isLoading: isLoading || isRefetching,
    refetch,
  };
};

export default useTasks;
