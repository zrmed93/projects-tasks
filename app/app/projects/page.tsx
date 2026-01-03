import { supabaseServer } from '@/lib/supabase/server'
import CreateProjectForm from '@/components/CreateProjectForm'

export default async function ProjectsPage() {
  const supabase = await supabaseServer()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: 600 }}>
          Projects
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Create and manage your projects
        </p>
      </div>

      <CreateProjectForm />

      {projects && projects.length > 0 ? (
        <ul className="projects-list">
          {projects.map((p) => (
            <li key={p.id} className="project-card">
              <a href={`/app/projects/${p.id}`}>{p.name}</a>
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            color: '#666',
            border: '1px dashed #e5e5e5',
            borderRadius: '8px',
          }}
        >
          <p>No projects yet. Create your first project above!</p>
        </div>
      )}
    </div>
  )
}
