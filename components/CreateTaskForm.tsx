'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add'}
    </button>
  )
}

export default function CreateTaskForm({
  projectId,
  createTaskAction,
}: {
  projectId: string
  createTaskAction: (projectId: string, formData: FormData) => Promise<any>
}) {
  return (
    <form action={createTaskAction.bind(null, projectId)} className="form-container">
      <input
        name="title"
        placeholder="New task"
        required
        disabled={false}
      />
      <SubmitButton />
    </form>
  )
}

