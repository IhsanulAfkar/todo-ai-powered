import { TArticle } from '@/types';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

    // Prevent build crash if env missing
    if (!backendUrl || !siteUrl) {
      return [];
    }

    const res = await fetch(`${backendUrl}/pub/articles`, {
      headers: {
        'x-api-key': apiKey || '',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const responseData = await res.json().catch(() => null);

    if (!responseData?.data) {
      return [];
    }

    const articles: TArticle[] = responseData.data ?? [];

    return articles.map((a) => ({
      url: `${siteUrl}/articles/${a.slug}`,
      lastModified: new Date(),
    }));
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return [];
  }
}
