'use client';
import { TArticle } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSort } from '../useSort';
import { useSyncUrl } from '../useSyncUrl';
import { buildUrl } from '@/lib/utils';
import { httpPublic } from '@/lib/httpPublic';

const usePublicDetailArticle = (slug: string) => {
  // const { order, sort } = useSort()
  // useSyncUrl({
  //     sortOrder: order.sortOrder,
  //     sortBy: sort.sortBy,
  // })
  const {
    data: response,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['public-article', slug],
    queryFn: async () => {
      return httpPublic.get<TArticle>(buildUrl('/pub/articles/' + slug));
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

export default usePublicDetailArticle;
