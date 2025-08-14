'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

type Session = SessionData | null

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionContextType {
  data: Session
  status: AuthStatus
  setData: Dispatch<SetStateAction<Session>>
  setStatus: Dispatch<SetStateAction<AuthStatus>>
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: 'loading',
  setData: () => {},
  setStatus: () => {},
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Session>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' })
        if (!isMounted) return

        if (res.ok) {
          const json: Session = await res.json()
          if (json) {
            setData(json)
            setStatus('authenticated')
          } else {
            setData(null)
            setStatus('unauthenticated')
          }
        } else {
          setData(null)
          setStatus('unauthenticated')
        }
      } catch {
        if (isMounted) {
          setData(null)
          setStatus('unauthenticated')
        }
      }
    }

    loadSession()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <SessionContext.Provider value={{ data, status, setData, setStatus }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
