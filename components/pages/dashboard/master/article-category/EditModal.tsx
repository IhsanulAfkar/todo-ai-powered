import InputForm from '@/components/form/InputForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { httpClient } from '@/lib/httpClient';
import { TArticleCategory } from '@/types';
import { useRouter } from '@bprogress/next/app';
import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  item: TArticleCategory;
}

const EditModal: NextPage<Props> = ({ isOpen, setIsOpen, item }) => {
  const router = useRouter();
  const methods = useForm<{ name: string }>({
    mode: 'onBlur',
    defaultValues: {
      name: item.name,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = methods;

  const onSubmit = async (formData: { name: string }) => {
    const data = await httpClient.put(`/article-categories/${item.id}`, {
      name: formData.name,
    });
    if (data.status == 200) {
      toast.success(data.message);
      router.refresh();
      setIsOpen(false);
      return;
    }
    toast.error(data.message);
  };
  return (
    <Dialog defaultOpen={isOpen} onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="w-full !max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
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

export default EditModal;
