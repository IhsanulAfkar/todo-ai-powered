import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { NextPage } from 'next';
import { Dispatch, SetStateAction, useState } from 'react';
interface Props {
  handler: () => Promise<void>;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const Alert: NextPage<Props> = ({ handler, setShow, show }) => {
  const handlePopup = () => {
    setShow(true);
  };
  const handleDelete = async () => {
    await handler();
    setShow(false);
  };
  return (
    <Dialog defaultOpen={show} onOpenChange={setShow} open={show}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <Trash2 />
          </div>
          <p className="font-bold">Are you sure want to delete this?</p>
          <p className="text-gray-90 my-1">
            This action will permanently remove item from system. You wont be
            able to undo this.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setShow(false)}
            variant={'outline'}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant={'destructive'}
            className="w-full"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Alert;
