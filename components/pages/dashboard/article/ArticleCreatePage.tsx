'use client';
import Filepond from '@/components/default/Filepond';
import RichEditor from '@/components/default/RichEditor';
import InputForm from '@/components/form/InputForm';
import { SelectForm } from '@/components/form/SelectForm';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useArticleCategory from '@/hooks/datasource/useArticleCategory';
import { toastValidation } from '@/lib/action/clientHelper';
import { httpClient } from '@/lib/httpClient';
import { useHeaderTitle } from '@/providers/HeaderTitleProvider';
import { useRouter } from '@bprogress/next/app';
import { NextPage } from 'next';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FilePondFile } from 'filepond';
type TArticleForm = {
  title: string;
  content: string;
  category_id: number;
};
const ArticleCreatePage: NextPage = () => {
  useHeaderTitle('Create Article');
  const router = useRouter();
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const { data, isLoading } = useArticleCategory();
  const methods = useForm<TArticleForm>({
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = methods;
  const onSubmit = async (formData: TArticleForm) => {
    try {
      const httpForm = new FormData();
      files.forEach((f) => {
        console.log(files, f.file);
        httpForm.append('files[]', f.file);
      });
      httpForm.append('category_id', formData.category_id.toString());
      httpForm.append('content', formData.content);
      httpForm.append('title', formData.title);
      const { data, message, status } = await httpClient.post(
        '/articles',
        httpForm,
      );
      if (status == 200) {
        toast.success('Success create article');
        router.push('/dashboard/article');
        return;
      }
      toast.error(message);
      toastValidation(data);
    } catch (error) {
      console.error(error, 'ini error');
      toast.error('server error');
    }
  };
  return (
    <div>
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
        <SelectForm
          control={methods.control}
          name="category_id"
          options={data.map((item) => ({
            id: item.id.toString(),
            name: item.name,
          }))}
          label="Category"
        />

        <div>
          <Label>Article Images</Label>
          <Filepond
            files={files}
            setFiles={setFiles}
            acceptedFileTypes={['image/*']}
          />
        </div>
        <div>
          <Label>Content</Label>

          {errors.content && (
            <p className="text-xs text-red-700">{errors.content.message}</p>
          )}
          <div className="mt-2">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichEditor text={field.value} setText={field.onChange} />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="mt-4 px-8" size={'lg'}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleCreatePage;
