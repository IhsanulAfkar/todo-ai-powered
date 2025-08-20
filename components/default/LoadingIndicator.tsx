import { cn } from '@/lib/utils';
import { NextPage } from 'next';
import { PulseLoader } from 'react-spinners';
interface Props {
  size?: number;
  className?: string;
}
const LoadingIndicator: NextPage<Props> = ({ size = 10, className = '' }) => {
  return (
    <div
      className={cn('flex w-full items-center justify-center py-2', className)}
    >
      <PulseLoader color="#1b59f8" loading speedMultiplier={0.8} size={size} />
    </div>
  );
};

export default LoadingIndicator;
