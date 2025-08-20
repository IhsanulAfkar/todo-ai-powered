import { useRouter } from '@bprogress/next/app';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function useSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortByFromUrl = searchParams.get('sortBy') || '';
  const sortOrderFromUrl = searchParams.get('sortOrder') || 'asc';
  const [sortBy, setSortBy] = useState<string>(sortByFromUrl);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    sortOrderFromUrl as 'asc' | 'desc',
  );
  return {
    sort: {
      sortBy,
      setSortBy,
    },
    order: {
      sortOrder,
      setSortOrder,
    },
  };
}
