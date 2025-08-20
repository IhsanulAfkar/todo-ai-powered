import SocketPage from '@/components/pages/dashboard/socket/SocketPage';
import { APP_NAME } from '@/lib/clientConst';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Socket Example | ' + APP_NAME,
};

const Page: NextPage = () => {
  return <SocketPage />;
};

export default Page;
