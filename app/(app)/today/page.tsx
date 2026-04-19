import { getTodayTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { StatCard } from '@/components/stat-card'
import { TaskListClient } from '@/components/task-list-client'
import { ProjectDot } from '@/components/project-dot'
import { CreateTaskModal } from '@/components/create-task-modal'
import { getTodayString } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export default async function TodayPage() {
  const today = getTodayString()
  const [tasks, projects, supabase] = await Promise.all([
    getTodayTasks(today),
    getProjects(),
    createClient(),
  ])

  const [{ count: totalToday }, { count: completedToday }, { count: overdueCount }] =
    await Promise.all([
      supabase.from('tasks').select('*', { count: 'exact', head: true })
        .is('deleted_at', null).or(`due_date.lte.${today},priority.eq.urgent`),
      supabase.from('tasks').select('*', { count: 'exact', head: true })
        .is('deleted_at', null).eq('completed', true).gte('completed_at', `${today}T00:00:00`),
      supabase.from('tasks').select('*', { count: 'exact', head: true })
        .is('deleted_at', null).eq('completed', false).lt('due_date', today),
    ])

  const total = totalToday ?? 0
  const done = completedToday ?? 0
  const overdue = overdueCount ?? 0

  const byProject = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    const key = t.project_id
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-5 pb-0 flex items-start justify-between flex-shrink-0">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Today</h1>
          <p className="text-[12px] text-[#454a5c] mt-0.5 font-medium">{dateLabel}</p>
        </div>
        <CreateTaskModal projects={projects} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div className="flex gap-3">
          <StatCard
            label="Completed Today"
            value={`${done}/${total}`}
            progress={total > 0 ? (done / total) * 100 : 0}
          />
          <StatCard
            label="Overdue"
            value={overdue}
            sub={overdue > 0 ? 'needs attention' : 'all clear'}
            subColor={overdue > 0 ? '#f87171' : '#34d399'}
          />
        </div>

        {Object.keys(byProject).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[15px] font-bold text-[#f0f0f5] mb-1"
               style={{ fontFamily: 'var(--font-display)' }}>All clear for today</p>
            <p className="text-[13px] text-[#9099b0] font-medium">No urgent or overdue tasks.</p>
          </div>
        ) : (
          Object.entries(byProject).map(([, projectTasks]) => {
            const proj = (projectTasks[0] as any).project
            return (
              <div key={proj?.name ?? 'unknown'}>
                <div className="flex items-center gap-2 mb-2">
                  <ProjectDot color={proj?.color ?? '#7C6FF7'} />
                  <span className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px]"
                        style={{ fontFamily: 'var(--font-display)' }}>
                    {proj?.name ?? 'Unknown'}
                  </span>
                  <span className="text-[10px] bg-[rgba(255,255,255,0.05)] text-[#454a5c] px-1.5 py-0.5 rounded-lg font-semibold">
                    {projectTasks.length}
                  </span>
                </div>
                <TaskListClient
                  tasks={projectTasks}
                  showProject={false}
                  emptyTitle="No tasks"
                  emptyDescription=""
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
