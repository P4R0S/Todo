import { getTodayTasks } from '@/lib/actions/tasks'
import { StatCard } from '@/components/stat-card'
import { TaskListClient } from '@/components/task-list-client'
import { ProjectDot } from '@/components/project-dot'
import { getTodayString } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TodayPage() {
  const today = getTodayString()
  const tasks = await getTodayTasks(today)
  const supabase = await createClient()

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
          <h1 className="text-[20px] font-bold tracking-tight">Today</h1>
          <p className="text-[12px] text-[#4a4f5a] mt-0.5">{dateLabel}</p>
        </div>
        <Link href="/projects">
          <Button size="sm" className="shadow-[0_0_16px_rgba(94,106,210,0.3)]">
            <Plus className="w-3 h-3 mr-1" /> Add Task
          </Button>
        </Link>
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
            subColor={overdue > 0 ? '#f87171' : '#4ade80'}
          />
        </div>

        {Object.keys(byProject).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[15px] font-semibold text-[#ededef] mb-1">All clear for today</p>
            <p className="text-[13px] text-[#8a8f98]">No urgent or overdue tasks.</p>
          </div>
        ) : (
          Object.entries(byProject).map(([, projectTasks]) => {
            const proj = (projectTasks[0] as any).project
            return (
              <div key={proj?.name ?? 'unknown'}>
                <div className="flex items-center gap-2 mb-2">
                  <ProjectDot color={proj?.color ?? '#5E6AD2'} />
                  <span className="text-[11px] font-semibold text-[#4a4f5a] uppercase tracking-[0.8px]">
                    {proj?.name ?? 'Unknown'}
                  </span>
                  <span className="text-[10px] bg-[rgba(255,255,255,0.06)] text-[#4a4f5a] px-1.5 py-0.5 rounded-lg">
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
