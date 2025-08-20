import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SyncOptions {
  [key: string]: string | number | undefined;
}

export function useSyncUrl(options: SyncOptions) {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    const newUrl = `?${params.toString()}`;

    if (window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [router, ...Object.values(options)]);
}
