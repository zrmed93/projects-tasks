'use client'

import { useFormStatus } from 'react-dom'
import { createProject } from '@/app/app/projects/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create'}
    </button>
  )
}

export default function CreateProjectForm() {
  return (
    <form action={createProject} className="form-container">
      <input
        name="name"
        placeholder="Project name"
        required
        disabled={false}
      />
      <SubmitButton />
    </form>
  )
}

