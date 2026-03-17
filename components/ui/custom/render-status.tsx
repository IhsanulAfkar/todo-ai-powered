import { cn } from '@/lib/utils'
import { NextPage } from 'next'

interface Props {
  status: string,
  className?: string
}

const RenderStatus: NextPage<Props> = ({ status, className }) => {
  return <p
    className={cn(
      "font-semibold",
      status === "Pending" &&
      "text-yellow-700 dark:text-yellow-400",
      status === "Ongoing" &&
      "text-blue-700 dark:text-blue-400",
      status === "Completed" &&
      "text-green-700 dark:text-green-400",
      className
    )}
  >
    {status}
  </p>
}

export default RenderStatus