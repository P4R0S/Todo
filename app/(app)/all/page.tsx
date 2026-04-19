import { getAllTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { TaskListClient } from '@/components/task-list-client'
import { ProjectDot } from '@/components/project-dot'
import { CreateTaskModal } from '@/components/create-task-modal'

export default async function AllPage() {
  const [tasks, projects] = await Promise.all([getAllTasks(), getProjects()])

  const byProject = projects.reduce<Record<string, typeof tasks>>((acc, p) => {
    acc[p.id] = tasks.filter(t => t.project_id === p.id)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-5 pb-0 flex items-start justify-between flex-shrink-0">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>All Tasks</h1>
          <p className="text-[12px] text-[#454a5c] mt-0.5 font-medium">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} across {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateTaskModal projects={projects} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[15px] font-bold text-[#f0f0f5] mb-1"
               style={{ fontFamily: 'var(--font-display)' }}>No projects yet</p>
            <p className="text-[13px] text-[#9099b0] font-medium">Create a project to start adding tasks.</p>
          </div>
        ) : (
          projects.map(p => (
            <div key={p.id}>
              <div className="flex items-center gap-2 mb-2">
                <ProjectDot color={p.color} />
                <span className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px]"
                      style={{ fontFamily: 'var(--font-display)' }}>
                  {p.name}
                </span>
                <span className="text-[10px] bg-[rgba(255,255,255,0.05)] text-[#454a5c] px-1.5 py-0.5 rounded-lg font-semibold">
                  {byProject[p.id]?.length ?? 0}
                </span>
              </div>
              <TaskListClient
                tasks={byProject[p.id] ?? []}
                projectId={p.id}
                showProject={false}
                emptyTitle="No tasks"
                emptyDescription="Add your first task."
                quickAddPlaceholder={`Add to ${p.name}…`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
