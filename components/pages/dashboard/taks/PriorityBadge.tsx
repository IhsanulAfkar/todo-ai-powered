import { Badge } from '@/components/ui/badge';
import { NextPage } from 'next'

interface Props {
  priority: string
}
const priorityStyles: Record<string, string> = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Urgent: "bg-red-100 text-red-700 border-red-200",
};

const PriorityBadge: NextPage<Props> = ({ priority }) => {
  const style =
    priorityStyles[priority] ??
    "bg-muted text-muted-foreground border";

  return (
    <Badge variant="outline" className={style}>
      {priority}
    </Badge>
  );
}

export default PriorityBadge