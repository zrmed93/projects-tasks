import { supabaseServer } from '@/lib/supabase/server'

type AuditAction =
  | 'project.created'
  | 'task.created'
  | 'task.toggled'
  | 'member.invited'
  | 'member.joined'

export async function logEvent({
  orgId,
  actor,
  action,
  entityType,
  entityId,
  metadata,
}: {
  orgId: string
  actor: string
  action: AuditAction
  entityType?: string
  entityId?: string
  metadata?: Record<string, any>
}) {
  const supabase = await supabaseServer()

  await supabase.from('audit_logs').insert({
    org_id: orgId,
    actor,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  })
}
