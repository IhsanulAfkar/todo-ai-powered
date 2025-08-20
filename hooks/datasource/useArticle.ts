'use client';
import { httpClient } from '@/lib/httpClient';
import { TArticle, TArticleCategory, TResponseMeta } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSort } from '../useSort';
import { useSyncUrl } from '../useSyncUrl';
import { buildUrl } from '@/lib/utils';

const useArticle = () => {
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
  } = useQuery({
    queryKey: ['article', order.sortOrder, sort.sortBy],
    queryFn: async () => {
      return httpClient.get<TArticle[]>(
        buildUrl('/articles', {
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
    isLoading,
    refetch,
  };
};

export default useArticle;
