import { RichTextRender } from "@/components/default/RichTextRender";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TTask } from "@/hooks/datasource/useTasks";
import PriorityBadge from "./PriorityBadge";
import { dateFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateTaskStatus } from "@/lib/action/clientAction";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  task?: TTask | null;
}

export default function TaskDetailModal({ open, setOpen, task }: Props) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full md:max-w-5xl!">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="w-full lg:max-w-xs flex flex-col gap-4">
            <div className="space-y-1">
              <Label>Thumbnail</Label>
              {task.images.length > 0 &&
                <img src={`${task.images[0].file_path}`} className="w-full h-32 object-contain
          " />
              }
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <p>{dateFormat(task.date)}</p>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <p>{task.status}</p>
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <div className="w-full flex flex-col">
            <Label>Content</Label>
            <RichTextRender html={task.content} />
          </div>
        </div>
        {/* action buttons */}
        <div className="flex justify-end">
          <Button onClick={() => updateTaskStatus(task.id, 'Ongoing', () => { window.location.reload() })}>Ongoing</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}