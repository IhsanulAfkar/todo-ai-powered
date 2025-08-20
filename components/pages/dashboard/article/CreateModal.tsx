import InputForm from '@/components/form/InputForm';
import { SelectForm } from '@/components/form/SelectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useArticleCategory from '@/hooks/datasource/useArticleCategory';
import { ModalProps } from '@/types/props';
import { useRouter } from '@bprogress/next/app';
import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type TArticleForm = {
  title: string;
  content: string;
  category_id: number;
};

const CreateModal: NextPage<ModalProps> = ({ isOpen, setIsOpen, refresh }) => {
  const router = useRouter();
  const { data, isLoading } = useArticleCategory();
  const methods = useForm<TArticleForm>({
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  const onSubmit = async (formData: TArticleForm) => {
    try {
      console.log(formData);
    } catch (error) {}
  };
  return (
    <Dialog defaultOpen={isOpen} onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="w-full !max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Article</DialogTitle>
        </DialogHeader>
        {/* content */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            register={register}
            config={{
              title: 'Title',
              name: 'title',
              type: 'text',
              registerConfig: {
                required: 'cannot be empty',
              },
              error: errors.title,
            }}
            className="mt-2"
          />
          <div>
            <Label>Content</Label>
            <Textarea
              className="mt-2"
              {...register('content', {
                required: 'content cannot be empty',
              })}
            />
            {errors.content && (
              <p className="text-xs text-red-700">{errors.content.message}</p>
            )}
          </div>
          <SelectForm
            control={methods.control}
            name="category_id"
            options={data.map((item) => ({
              id: item.id.toString(),
              name: item.name,
            }))}
            label="Category"
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
