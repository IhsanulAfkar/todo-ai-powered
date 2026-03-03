'use client';

import { signOut } from '@/lib/action/clientAction';
import { SessionData } from '@/lib/session';
import { withBasePath } from '@/lib/utils';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Session = SessionData | null;
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface SessionContextType {
  data: Session;
  status: AuthStatus;
  setData: Dispatch<SetStateAction<Session>>;
  setStatus: Dispatch<SetStateAction<AuthStatus>>;
  reloadSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: 'loading',
  setData: () => {},
  setStatus: () => {},
  reloadSession: async () => {},
  signOut: async () => {},
});

const ignoredRoutes = ['/', '/auth/login'];

const StatusModal = ({
  open,
  title,
  message,
  actions,
}: {
  open: boolean;
  title: string;
  message: string;
  actions?: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="bg-card relative w-full max-w-md rounded-md p-6 shadow-xl">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{message}</p>
        {actions ? (
          <div className="mt-6 flex justify-end gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
};

export function SessionProvider({
  children,
  session = null,
}: {
  children: ReactNode;
  session?: SessionData | null;
}) {
  const [data, setData] = useState<Session>(session ?? null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const [hadSession, setHadSession] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const pathname = usePathname();

  const fetchSession = useCallback(async () => {
    // If the browser already knows it’s offline, treat as network error
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('OFFLINE');
    }

    const res = await fetch(withBasePath('/api/auth/session'), {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      // This is a server response, not a network error
      return null;
    }

    const json: Session = await res.json();
    return json;
  }, []);

  const reloadSession = useCallback(async () => {
    try {
      // keep current status unless you want to force loading UI
      setNetworkError(false);

      const session = await fetchSession();

      if (session) {
        setData(session);
        setStatus('authenticated');
        setHadSession(true);
        setShowExpired(false);
      } else {
        // Request succeeded but no session => expired/unauth
        setShowExpired(true);
        setData(null);
        setStatus('unauthenticated');
      }
    } catch {
      // Fetch threw => network/CORS/DNS/offline/etc
      setNetworkError(true);

      // IMPORTANT: don’t mark as expired on network failure
      setShowExpired(false);

      // Optional: keep existing data/status instead of forcing logout feeling
      // If you prefer, you can set status to 'unauthenticated' here, but
      // that often feels like a logout when it’s just offline.
      // setStatus('unauthenticated')
    }
  }, [fetchSession]);

  useEffect(() => {
    const onFocus = () => reloadSession();
    const onVisible = () => {
      if (document.visibilityState === 'visible') reloadSession();
    };

    // Bonus: update banner when connectivity changes
    const onOnline = () => {
      setNetworkError(false);
      reloadSession();
    };
    const onOffline = () => setNetworkError(true);

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [reloadSession]);

  const shouldShowModal = useMemo(() => {
    if (!pathname) return { expired: showExpired, network: networkError };

    const isIgnored = ignoredRoutes.some((r) => pathname === r);
    if (isIgnored) return { expired: false, network: false };

    return { expired: showExpired, network: networkError };
  }, [showExpired, networkError, pathname]);

  return (
    <SessionContext.Provider
      value={{ data, status, setData, setStatus, reloadSession, signOut }}
    >
      {children}

      <StatusModal
        open={shouldShowModal.network}
        title="Network not connected"
        message="It looks like you’re offline or the connection is unstable. Please check your internet connection and try again."
        actions={
          <>
            <Button variant="outline" onClick={reloadSession}>
              Retry
            </Button>
          </>
        }
      />

      <StatusModal
        open={shouldShowModal.expired}
        title="Session expired"
        message="Your session has expired due to inactivity. Please log in again."
        actions={
          <Button onClick={() => signOut()} variant="destructive">
            Logout
          </Button>
        }
      />
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
