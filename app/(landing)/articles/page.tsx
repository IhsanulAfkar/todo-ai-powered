import ArticlePage from '@/components/pages/landing/ArticlePage';
import { APP_NAME } from '@/lib/clientConst';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Articles | ' + APP_NAME,
};
const Page: NextPage = () => {
  return <ArticlePage />;
};

export default Page;
