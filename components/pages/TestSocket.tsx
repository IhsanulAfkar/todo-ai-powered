'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { SOCKET_EMIT_TYPES } from '@/lib/constant';
import { httpClient } from '@/lib/httpClient';
import { useSession } from '@/providers/SessionProvider';
import { NextPage } from 'next';
import { toast } from 'sonner';

const TestSocket: NextPage = () => {
  const handleSocket = async (type: string, isActive: boolean) => {
    const { data, status } = await httpClient.get(
      `/test-socket/${type}/${isActive ? 'on' : 'off'}`,
    );
    if (status == 200) {
      // toast.success('Test socket successfully for ' + type);
      return;
    }
    toast.error(data.message ?? 'Something wrong');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p>Test Socket</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {SOCKET_EMIT_TYPES.map((item) => (
          <DropdownMenuItem key={item} onClick={() => handleSocket(item, true)}>
            <span>{item}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TestSocket;
