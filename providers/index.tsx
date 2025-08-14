'use client'
import { NextPage } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import QueryProvider from './QueryProvider'
import { ProgressProvider } from '@bprogress/next/app'
import { SessionProvider } from './SessionProvider'

interface Props {
    children: ReactNode
}

const Providers: NextPage<Props> = ({ children }) => {
    return <>
        <Toaster richColors position="top-right" expand />
        <SessionProvider>

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
        </SessionProvider>
    </>
}

export default Providers