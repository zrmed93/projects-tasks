import { supabaseServer } from '@/lib/supabase/server'
import "./activity.css"


export default async function ActivityPage() {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return

  const { data: org } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", data.user.id)
    .limit(1)
    .single()


  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select(
      `
        id,
        action,
        created_at,
        entity_type,
        entity_id,
        actor
      `
    )
    .eq("org_id", org!.org_id)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    throw error
  }


  return (
    <div className="activity-page">
      <h2>Activity</h2>

      {logs?.length === 0 && <p>No activity yet.</p>}

      <ul className="activity-list">
        {logs?.map((log) => (
          <li key={log.id} className="activity-item">
            <div className="activity-main">
              {/* <span className="activity-actor">
                {log.actor?.email ?? "System"}
              </span> */}
              <span className="activity-action">
                {formatAction(log.action)}
              </span>
            </div>

            <div className="activity-meta">
              <time dateTime={log.created_at}>
                {new Date(log.created_at).toLocaleString()}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatAction(action: string) {
  switch (action) {
    case "project.created":
      return "created a project"
    case "task.created":
      return "created a task"
    case "task.toggled":
      return "updated a task"
    case "member.invited":
      return "invited a member"
    case "member.joined":
      return "joined the organization"
    default:
      return action
  }
}
