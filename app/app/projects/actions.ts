'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { logEvent } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const name = formData.get('name')?.toString().trim()
  if (!name) throw new Error('Project name is required')

  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's org (single org assumption)
  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) throw new Error('No organization')

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      name,
      org_id: membership.org_id,
    })
    .select()
    .single()

  if (error) throw error

  await logEvent({
    orgId: membership.org_id,
    actor: user.id,
    action: 'project.created',
    entityType: 'project',
    entityId: project.id,
  })

  revalidatePath('/app/projects')
  return project
}
