'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { logEvent } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

async function getContext(projectId: string) {
  const supabase = await supabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: project } = await supabase
    .from('projects')
    .select('id, org_id')
    .eq('id', projectId)
    .single()

  if (!project) throw new Error('Project not found')

  return { supabase, user, project }
}

/* ---------------- CREATE ---------------- */

export async function createTask(
  projectId: string,
  formData: FormData
) {
  const title = formData.get('title')?.toString().trim()
  if (!title) throw new Error('Title required')

  const { supabase, user, project } = await getContext(projectId)

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      title,
      project_id: project.id,
      org_id: project.org_id,
    })
    .select()
    .single()

  if (error) throw error

  await logEvent({
    orgId: project.org_id,
    actor: user.id,
    action: 'task.created',
    entityType: 'task',
    entityId: task.id,
  })

  revalidatePath(`/app/projects/${projectId}`)
  return task
}

/* ---------------- TOGGLE ---------------- */

export async function toggleTask(taskId: string) {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: task } = await supabase
    .from('tasks')
    .select('id, done, org_id, project_id')
    .eq('id', taskId)
    .single()

  if (!task) throw new Error('Task not found')

  const { error } = await supabase
    .from('tasks')
    .update({ done: !task.done })
    .eq('id', taskId)

  if (error) throw error

  await logEvent({
    orgId: task.org_id,
    actor: user.id,
    action: 'task.toggled',
    entityType: 'task',
    entityId: task.id,
    metadata: { done: !task.done },
  })

  revalidatePath(`/app/projects/${task.project_id}`)
}

/* ---------------- DELETE ---------------- */

export async function deleteTask(taskId: string) {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: task } = await supabase
    .from('tasks')
    .select('id, org_id, project_id')
    .eq('id', taskId)
    .single()

  if (!task) throw new Error('Task not found')

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error

  revalidatePath(`/app/projects/${task.project_id}`)
}
