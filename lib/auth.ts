import { supabaseServer } from '@/lib/supabase/server'

export async function ensureOrganization(userId: string) {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getSession()


  // Check memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('org_id')
    .eq('user_id', userId)
    .limit(1)

  if (memberships && memberships.length > 0) {
    return memberships[0].org_id
  }

  // Create org
  const { data: org, error } = await supabase
    .from('organizations')
    .insert({ name: 'My Organization' })
    .select( )
    .single()
  if (error) throw error

  // Create owner membership
  await supabase.from('memberships').insert({
    org_id: org.id,
    user_id: userId,
    role: 'owner',
  })

  // Audit log
  await supabase.from('audit_logs').insert({
    org_id: org.id,
    actor: userId,
    action: 'member.joined',
  })

  return org.id
}
