import useTaskId from '@/hooks/datasource/useTaskId'
import { NextPage } from 'next'
import TaskDetailModal from './TaskDetailModal'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props { task_id: number, children: ReactNode }

const TaskFetchId: NextPage<Props> = ({ task_id, children }) => {
  const [open, setOpen] = useState(false)
  const { data } = useTaskId(task_id)

  if (!data) return <>{children}</>

  return (
    <>
      <Button variant={'outline'} className='w-full ' asChild onClick={() => setOpen(true)}>
        {children}
      </Button>

      <TaskDetailModal
        open={open}
        setOpen={setOpen}
        task={data}
      />
    </>
  )
}

export default TaskFetchId