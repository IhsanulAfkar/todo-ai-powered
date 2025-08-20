import { TArticle } from '@/types';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/pub/articles',
    {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_BACKEND_API_KEY || '',
      },
    },
  );
  const responseData = await res.json();
  const articles: TArticle[] = responseData.data ?? [];

  return articles.map((a) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${a.slug}`,
    lastModified: new Date().toISOString(),
  }));
}
