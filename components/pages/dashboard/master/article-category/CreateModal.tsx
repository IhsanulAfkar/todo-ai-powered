import InputForm from '@/components/form/InputForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toastValidation } from '@/lib/action/clientHelper';
import { httpClient } from '@/lib/httpClient';
import { ModalProps } from '@/types/props';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CreateModal: NextPage<ModalProps> = ({ isOpen, setIsOpen, refresh }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ name: string }>({
    mode: 'onBlur',
  });
  const onSubmit = async (data: { name: string }) => {
    try {
      const { data: response, status } = await httpClient.post(
        '/article-categories',
        {
          name: data.name,
        },
      );
      if (status == 200) {
        toast.success('Success create category');
        setIsOpen(false);
        if (refresh) refresh();
        return;
      }
      console.log(response);
      toastValidation(response);
      // toast.error(response.data?.message);
    } catch (error) {
      console.error(error, 'masuk');
      toast.error('Server Error');
    }
  };
  return (
    <Dialog defaultOpen={isOpen} onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="w-full !max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        {/* content */}
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            register={register}
            config={{
              title: 'Name',
              name: 'name',
              type: 'text',
              placeholder: 'your category name here',
              registerConfig: {
                required: 'cannot be empty',
              },
              error: errors.name,
            }}
            className="mt-2"
          />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
