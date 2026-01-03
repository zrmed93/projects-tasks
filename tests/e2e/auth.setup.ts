import { test as setup } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

setup('authenticate', async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123',
  })

  fs.writeFileSync(
    'tests/e2e/.auth.json',
    JSON.stringify(data.session)
  )
})
