import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TTask } from "@/hooks/datasource/useTasks";
import PriorityBadge from "./PriorityBadge";

interface Props {
  task: TTask;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition"
    >
      <CardHeader>
        <CardTitle className="flex justify-between"><p>{task.title}</p>   <PriorityBadge priority={task.priority} /></CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* <p className="font-semibold">{task.title}</p> */}
        {task.images.length > 0 &&
          <img src={`${task.images[0].file_path}`} className="w-full h-32 object-contain
          " />
        }
        <p className="text-sm text-muted-foreground">
          {new Date(task.date).toLocaleDateString()}
        </p>


      </CardContent>
    </Card>
  );
}