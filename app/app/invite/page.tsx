import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logEvent } from '@/lib/audit'

export default async function AcceptInvite({
    searchParams,
}: {
 // searchParams: { token?: string }
 searchParams: Promise<{ token?: string }>

}) {

    const { token } = await searchParams

  if (!token) redirect('/app')

  const supabase = await supabaseServer()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) redirect('/')

  const { data: invite } = await supabase
    .from('invites')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .single()

//   if (!invite || invite.email !== user.email) {
//     redirect('/app')
//   }

  // Check if user is already a member
  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('id')
    .eq('org_id', invite.org_id)
    .eq('user_id', user.id)
    .single()

  if (existingMembership) {
    // Already a member, just mark invite as accepted and redirect
    await supabase
      .from('invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)
    redirect('/app')
    return
  }

  await supabase.from('memberships').insert({
    org_id: invite.org_id,
    user_id: user.id,
    role: 'member',
  })

  await supabase
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  await logEvent({
    orgId: invite.org_id,
    actor: user.id,
    action: 'member.joined',
  })

  redirect('/app')
}
