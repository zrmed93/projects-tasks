'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Invite'}
    </button>
  )
}

export default function CreateInviteForm({
  orgId,
  createInviteAction,
}: {
  orgId: string
  createInviteAction: (orgId: string, email: string) => Promise<any>
}) {
  return (
    <form
      action={async (formData: FormData) => {
        const email = formData.get('email')?.toString().trim()
        if (email) {
          await createInviteAction(orgId, email)
        }
      }}
      className="form-container"
    >
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
      />
      <SubmitButton />
    </form>
  )
}

