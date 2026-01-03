'use client'

import { supabaseClient } from '@/lib/supabase/client'

function SignInButton() {
  async function signIn() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  return <button onClick={signIn}>Sign in with Google</button>
}

export default SignInButton
