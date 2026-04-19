import { notFound } from 'next/navigation'
import { getTasksForProject } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { TaskListClient } from '@/components/task-list-client'
import { CreateTaskModal } from '@/components/create-task-modal'
import { ProjectActionsMenu } from '@/components/project-actions-menu'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [projects, tasks] = await Promise.all([getProjects(), getTasksForProject(id)])
  const project = projects.find(p => p.id === id)
  if (!project) notFound()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-5 pb-0 flex items-start justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shadow-[0_0_8px_var(--c)]"
                style={{ background: project.color, ['--c' as any]: `${project.color}80` }} />
          <h1 className="text-[20px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {project.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ProjectActionsMenu projectId={id} projectName={project.name} projectColor={project.color} />
          <CreateTaskModal projects={projects} defaultProjectId={id} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <TaskListClient
          tasks={tasks}
          projectId={id}
          showProject={false}
          emptyTitle="No tasks yet"
          emptyDescription="Add your first task to get started."
          quickAddPlaceholder={`Add a task to ${project.name}…`}
        />
      </div>
    </div>
  )
}
