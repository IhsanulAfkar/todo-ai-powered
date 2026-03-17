import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TTask } from "@/hooks/datasource/useTasks";
import PriorityBadge from "./PriorityBadge";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { dateFormat } from "@/lib/utils";

interface Props {
  task: TTask;
  onClick: () => void;
}

export default function DraggableTaskCard({ task, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        task
      }
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">

      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute top-1 right-2 cursor-grab text-muted-foreground"
      >
        ☰
      </div>
      <Card
        onClick={onClick}
        className="cursor-pointer hover:shadow-md transition"
      >
        <CardHeader>
          <CardTitle className="flex justify-between gap-2">
            <p>{task.title}</p>
            <div className="flex-none">

              <PriorityBadge priority={task.priority} />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {task.images.length > 0 && (
            <img
              src={task.images[0].file_path}
              className="w-full h-32 object-contain"
            />
          )}

          <p className="text-sm text-muted-foreground">
            {dateFormat(task.date)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}