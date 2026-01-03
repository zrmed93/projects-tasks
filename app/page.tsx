import SignInButton from '@/components/SignInButton'
import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()

  // Redirect authenticated users to the dashboard
  if (data.user) {
    redirect('/app')
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Projects & Tasks</h1>
      <SignInButton />
    </main>
  )
}
