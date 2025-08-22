'use client';
import { NextPage } from 'next';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import QueryProvider from './QueryProvider';
import { ProgressProvider } from '@bprogress/next/app';
import { SessionProvider } from './SessionProvider';
import { HeaderTitleProvider } from './HeaderTitleProvider';
import { SocketProvider } from './SocketProvider';
import dynamic from 'next/dynamic';
const NextThemesProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  {
    ssr: false,
  },
);

interface Props {
  children: ReactNode;
}

const Providers: NextPage<Props> = ({ children }) => {
  return (
    <>
      <Toaster richColors position="top-right" expand />
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>
          <HeaderTitleProvider>
            <QueryProvider>
              <ProgressProvider
                height="4px"
                color="#193fb2"
                options={{ showSpinner: true }}
                shallowRouting
              >
                {children}
              </ProgressProvider>
            </QueryProvider>
          </HeaderTitleProvider>
        </SessionProvider>
      </NextThemesProvider>
    </>
  );
};

export default Providers;
