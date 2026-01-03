'use client'

import { useFormStatus } from 'react-dom'

function ToggleButton({ done }: { done: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {done ? '✅' : '⬜'}
    </button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? '...' : '🗑'}
    </button>
  )
}

export default function TaskItem({
  task,
  toggleTaskAction,
  deleteTaskAction,
}: {
  task: { id: string; title: string; done: boolean }
  toggleTaskAction: (taskId: string) => Promise<void>
  deleteTaskAction: (taskId: string) => Promise<void>
}) {
  return (
    <li className="task-item">
      <form action={toggleTaskAction.bind(null, task.id)}>
        <ToggleButton done={task.done} />
      </form>

      <span className={`task-title ${task.done ? 'completed' : ''}`}>
        {task.title}
      </span>

      <form action={deleteTaskAction.bind(null, task.id)}>
        <DeleteButton />
      </form>
    </li>
  )
}

