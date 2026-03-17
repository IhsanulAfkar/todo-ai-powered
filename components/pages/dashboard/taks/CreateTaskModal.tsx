import RichEditor from '@/components/default/RichEditor'
import { DateTimeField } from '@/components/form/DateTimeField'
import FilepondField from '@/components/form/FilepondField'
import InputField from '@/components/form/InputField'
import { PriorityRadioField } from '@/components/form/PriorityRadioField'
import SelectField from '@/components/form/SelectField'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { httpClient } from '@/lib/httpClient'
import { NextPage } from 'next'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onUpdate?: () => void
}
type FormValues = {
  thumbnail: FileList
  title: string
  date: Date
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  content: string

}
const CreateTaskModal: NextPage<Props> = ({ open, setOpen, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<FormValues>()
  const onSubmit = async (data: FormValues) => {
    try {
      // console.log(data)
      // return
      const formData = new FormData()

      if (data.thumbnail?.[0]) {
        formData.append('thumbnail', data.thumbnail[0])
      }

      formData.append('title', data.title)
      formData.append('date', data.date.toISOString())
      formData.append('priority', data.priority)
      formData.append('content', data.content)

      const { data: response, message, status } = await httpClient.post('/api/tasks', formData)

      if (status === 200) {
        toast.success('Success create new task')
        onUpdate?.()
        setOpen(false)
        return
      }
      toast.error(message)
    } catch (err: any) {
      toast.error(err.message || 'Server Error')
      console.error(err)
    }
  }
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])
  if (!open) return <></>
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className='w-full md:max-w-5xl!'>
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mt-4"
      >
        <div className="flex lg:flex-row flex-col gap-4">

          {/* LEFT PANEL */}
          <div className="w-full lg:max-w-xs flex flex-col gap-4">

            <div>
              <Label>Thumbnail</Label>
              <FilepondField
                name="thumbnail"
                control={control}
                acceptedFileTypes={['image/png', 'image/jpeg']}
              />
            </div>

            <InputField
              label="Title"
              placeholder="Enter task title"
              register={register("title", { required: "Title is required" })}
              error={errors.title}
            />
            <DateTimeField
              label="Task Date"
              name="date"
              control={control}
            />

            <PriorityRadioField
              label="Priority"
              name="priority"
              control={control}
              options={[
                { label: "Urgent", value: "Urgent", color: "#ef4444" },
                { label: "High", value: "High", color: "#f97316" },
                { label: "Medium", value: "Medium", color: "#eab308" },
                { label: "Low", value: "Low", color: "#22c55e" }
              ]}
            />

            {/* PUSH BUTTON TO BOTTOM */}
            <div className="mt-auto pt-4">
              <Button type="submit" className="w-full">
                Create
              </Button>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="w-full flex flex-col">
            <Label>Content</Label>

            <div className="mt-2 flex-1">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichEditor text={field.value} setText={field.onChange} />
                )}
              />
            </div>
          </div>

        </div>
      </form>
    </DialogContent>
  </Dialog>
}

export default CreateTaskModal