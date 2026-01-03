'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { logEvent } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function createInvite(orgId: string, email: string) {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if user is owner
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .single()

  if (!membership || membership.role !== 'owner') {
    throw new Error('Only owners can invite members')
  }

  const token = crypto.randomUUID()

  const { data, error } = await supabase.from('invites').insert({
    org_id: orgId,
    email,
    token,
  }).select().single()

  if (error) throw error

  await logEvent({
    orgId,
    actor: user.id,
    action: 'member.invited',
    metadata: { email },
  })

  revalidatePath('/app/invites')
  return data
}
