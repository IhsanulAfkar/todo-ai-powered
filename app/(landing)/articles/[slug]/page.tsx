import DetailArticlePage from '@/components/pages/landing/detail-article/DetailArticlePage';
import { APP_NAME } from '@/lib/clientConst';
import { httpPublic } from '@/lib/httpPublic';
import { httpServer } from '@/lib/httpServer';
import { TArticle } from '@/types';
import { Metadata, NextPage } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}
const getArticleBySlug = cache(async ({ slug }: { slug: string }) => {
  return await httpPublic.get<TArticle>('/pub/articles/' + slug);
});
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: article, status } = await getArticleBySlug({ slug });
  return {
    title: `${article.title} | ${APP_NAME}`,
    description: article.content.replace(/<[^>]+>/g, '').slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content.replace(/<[^>]+>/g, '').slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.slug}`,
      type: 'article',
    },
  };
}
const Page: NextPage<Props> = async ({ params }) => {
  const { slug } = await params;

  const { data: article, status } = await getArticleBySlug({ slug });
  if (!article) notFound();

  return <DetailArticlePage article={article} />;
};

export default Page;
