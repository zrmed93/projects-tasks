'use client'

import { supabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function signOut() {
    await supabaseClient.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={signOut} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      Sign Out
    </button>
  )
}

