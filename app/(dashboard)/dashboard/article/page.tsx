import ArticlePage from '@/components/pages/dashboard/article/ArticlePage';
import { APP_NAME } from '@/lib/clientConst';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Article | ' + APP_NAME,
};
const Page: NextPage = () => {
  return <ArticlePage />;
};

export default Page;
