import { Navbar1 } from '@/components/navbar1';
import { NextPage } from 'next';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <div className="container mx-auto px-2 xl:px-6">
        <Navbar1 />
      </div>
      <div className="container mx-auto px-2 xl:px-6">{children}</div>
    </>
  );
};

export default Layout;
