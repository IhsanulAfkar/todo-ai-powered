import { getServerSession } from '@/lib/serverSession';
import { SessionProvider } from '@/providers/SessionProvider';
import { GalleryVerticalEnd } from 'lucide-react';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session = await getServerSession()
  if (session) redirect('/dashboard')
  return (
    <SessionProvider session={session}>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">{children}</div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="/assets/images/image.png"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </SessionProvider>
  );
};

export default Layout;
