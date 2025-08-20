import { NextPage } from 'next';

interface Props {
  params: Promise<{ articleId: string }>;
}

const Page: NextPage<Props> = ({ params }) => {
  return <div></div>;
};

export default Page;
