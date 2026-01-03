import { supabaseServer } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import {
  createTask,
  toggleTask,
  deleteTask,
} from './actions'
import CreateTaskForm from '@/components/CreateTaskForm'
import TaskItem from '@/components/TaskItem'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await supabaseServer()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .single()

  if (!project) notFound()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, done')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: 600 }}>
          {project.name}
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {tasks?.length || 0} {tasks?.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* Create */}
      <CreateTaskForm
        projectId={project.id}
        createTaskAction={createTask}
      />

      {/* List */}
      {tasks && tasks.length > 0 ? (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleTaskAction={toggleTask}
              deleteTaskAction={deleteTask}
            />
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
          <p>No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  )
}
