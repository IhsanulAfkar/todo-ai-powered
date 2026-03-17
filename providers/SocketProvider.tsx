'use client';
import { getSocket } from '@/service/socket';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';
import { useSession } from './SessionProvider';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  on: (s: string, h: (data: any) => void) => void;
  off: (s: string) => void;
  emit: (s: string, h: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  on: () => { },
  off: () => { },
  emit: () => { },
});
export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(getSocket());
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const token = '';
  const userId = session?.user?.id;
  useEffect(() => {
    if (status === 'authenticated' && token && userId) {
      const newSocket = ClientIO(process.env.NEXT_PUBLIC_BACKEND_URL || '', {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket'],
      });
      socketRef.current = newSocket;
      setSocket(newSocket);
      newSocket.on('connect', () => {
        setIsConnected(true);
      });
      newSocket.on('connected', (data) => { });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
      });

      return () => {
        newSocket.disconnect();
        setIsConnected(false);
        socketRef.current = null;
        setSocket(null);
      };
    } else if (status === 'unauthenticated') {
      // Logout or no session
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [status, token]);
  const on = (channel: string, handler: (data: any) => void) => {
    // if (!socket || !userId) return;
    socketRef.current?.off(`${userId}:${channel}`);
    socketRef.current?.on(`${userId}:${channel}`, handler);
  };
  const off = (channel: string) => {
    if (!socketRef.current || !userId) return;
    socketRef.current?.off(`${userId}:${channel}`);
  };
  const emit = (channel: string, handler: (data: any) => void) => {
    if (!socketRef.current || !userId) return;
    socketRef.current?.emit(`${userId}:${channel}`, handler);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, on, off, emit }}>
      {children}
    </SocketContext.Provider>
  );
};
