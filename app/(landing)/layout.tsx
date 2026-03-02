import { Navbar1 } from '@/components/navbar1';
import { NextPage } from 'next';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="container mx-auto px-2 lg:px-20">
        <Navbar1 />
      </div>
      <div className="container mx-auto px-2 lg:px-20">{children}</div>
    </>
  );
};

export default Layout;
