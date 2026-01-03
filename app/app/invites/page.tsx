import { supabaseServer } from '@/lib/supabase/server'
import { createInvite } from './actions'
import CreateInviteForm from '@/components/CreateInviteForm'
import InviteLink from '@/components/InviteLink'
import { redirect } from 'next/navigation'

export default async function InvitesPage() {
  const supabase = await supabaseServer()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) redirect('/')

  // Get user's org and role
  const { data: membership } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect('/app')

  const isOwner = membership.role === 'owner'

  // Get invites for this org (only owners can see all invites)
  const { data: invites } = await supabase
    .from('invites')
    .select('id, email, token, created_at, accepted_at')
    .eq('org_id', membership.org_id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: 600 }}>
          Invites
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {isOwner
            ? 'Invite team members to join your organization'
            : 'You need to be an owner to invite members'}
        </p>
      </div>

      {isOwner && (
        <CreateInviteForm
          orgId={membership.org_id}
          createInviteAction={createInvite}
        />
      )}

      {!isOwner && (
        <div
          style={{
            padding: '24px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            color: '#856404',
            marginBottom: '32px',
          }}
        >
          <p style={{ margin: 0 }}>
            Only organization owners can invite new members.
          </p>
        </div>
      )}

      {invites && invites.length > 0 ? (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 600 }}>
            {isOwner ? 'Sent Invites' : 'Invites'}
          </h2>
          <ul className="projects-list">
            {invites.map((invite) => (
              <li key={invite.id} className="project-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                        {invite.email}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Sent {new Date(invite.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: invite.accepted_at ? '#d4edda' : '#fff3cd',
                        color: invite.accepted_at ? '#155724' : '#856404',
                      }}
                    >
                      {invite.accepted_at ? 'Accepted' : 'Pending'}
                    </div>
                  </div>
                  {!invite.accepted_at && isOwner && (
                    <InviteLink token={invite.token} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          style={{
            marginTop: '32px',
            padding: '48px',
            textAlign: 'center',
            color: '#666',
            border: '1px dashed #e5e5e5',
            borderRadius: '8px',
          }}
        >
          <p>No invites {isOwner ? 'sent yet. Send your first invite above!' : 'found.'}</p>
        </div>
      )}
    </div>
  )
}

