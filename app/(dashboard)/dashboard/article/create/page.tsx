import ArticleCreatePage from '@/components/pages/dashboard/article/ArticleCreatePage';
import { APP_NAME } from '@/lib/clientConst';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Create Article | ' + APP_NAME,
};
const Page: NextPage = () => {
  return <ArticleCreatePage />;
};

export default Page;
