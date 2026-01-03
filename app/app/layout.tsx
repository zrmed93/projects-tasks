import { supabaseServer } from '@/lib/supabase/server'
import { ensureOrganization } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) redirect('/')

  await ensureOrganization(data.user.id)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '200px',
          borderRight: '1px solid #e5e5e5',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
          Navigation
        </h2>
        <Link
          href="/app"
          style={{
            padding: '8px 12px',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '4px',
            display: 'block',
            transition: 'background-color 0.2s',
          }}
          className="sidebar-link"
        >
          Dashboard
        </Link>
        <Link
          href="/app/projects"
          style={{
            padding: '8px 12px',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '4px',
            display: 'block',
            transition: 'background-color 0.2s',
          }}
          className="sidebar-link"
        >
          Projects
        </Link>
        <Link
          href="/app/invites"
          style={{
            padding: '8px 12px',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '4px',
            display: 'block',
            transition: 'background-color 0.2s',
          }}
          className="sidebar-link"
        >
          Invites
        </Link>
        <Link
          href="/app/activity"
          style={{
            padding: '8px 12px',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '4px',
            display: 'block',
            transition: 'background-color 0.2s',
          }}
          className="sidebar-link"
        >
          Activity
        </Link>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            padding: '16px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '20px' }}>Projects & Tasks</h1>
          <LogoutButton />
        </header>
        <main style={{ flex: 1, padding: '16px' }}>{children}</main>
      </div>
    </div>
  )
}
