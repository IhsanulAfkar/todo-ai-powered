import ArticleCategoryPage from '@/components/pages/dashboard/master/article-category/ArticleCategoryPage';
import { APP_NAME } from '@/lib/clientConst';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Article Category | ' + APP_NAME,
};
const Page: NextPage = () => {
  return <ArticleCategoryPage />;
};

export default Page;
