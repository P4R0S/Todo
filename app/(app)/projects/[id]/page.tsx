import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTasksForProject } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { TaskListClient } from '@/components/task-list-client'
import { CreateTaskModal } from '@/components/create-task-modal'
import { ProjectActionsMenu } from '@/components/project-actions-menu'
import { ChevronLeft } from 'lucide-react'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [projects, tasks] = await Promise.all([getProjects(), getTasksForProject(id)])
  const project = projects.find(p => p.id === id)
  if (!project) notFound()

  const done = tasks.filter(t => t.completed).length
  const pct  = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Project header */}
      <div
        className="px-4 pt-4 pb-4 flex-shrink-0 border-b border-[rgba(255,255,255,0.06)]"
      >
        {/* Back link */}
        <Link
          href="/projects"
          className="flex items-center gap-1 text-[13px] text-[#454a5c] hover:text-[#9099b0] transition-colors mb-3.5 w-fit"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          Projects
        </Link>

        {/* Project identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{ background: `${project.color}18`, border: `1px solid ${project.color}30` }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }}
              />
            </div>
            <div>
              <h1
                className="text-[20px] font-extrabold text-[#f0f0f5] leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {project.name}
              </h1>
              <p className="text-[11px] text-[#454a5c] mt-0.5">
                {done}/{tasks.length} tasks complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ProjectActionsMenu projectId={id} projectName={project.name} projectColor={project.color} />
            <CreateTaskModal projects={projects} defaultProjectId={id} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div
            className="h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: project.color,
                boxShadow: `0 0 8px ${project.color}99`,
                transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
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
