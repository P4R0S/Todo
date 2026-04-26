import { getTodayTasks, getCompletedTodayTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { TaskListClient } from '@/components/task-list-client'
import { getTodayString } from '@/lib/utils'

export default async function TodayPage() {
  const today = getTodayString()
  const [activeTasks, completedTasks, projects] = await Promise.all([
    getTodayTasks(today),
    getCompletedTodayTasks(today),
    getProjects(),
  ])

  const total = activeTasks.length + completedTasks.length
  const done  = completedTasks.length
  const pct   = total ? Math.round((done / total) * 100) : 0

  const allTodayTasks = [...activeTasks, ...completedTasks] as any[]

  const dayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-0 flex-shrink-0">
        <p
          className="text-[11px] font-semibold text-[#454a5c] uppercase mb-1"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
        >
          {dayLabel}
        </p>
        <h1
          className="text-[26px] font-extrabold text-[#f0f0f5] leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Today
        </h1>

        {/* Progress bar */}
        <div className="mt-3.5 mb-1">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-[#454a5c] font-medium">
              {done} of {total} complete
            </span>
            <span
              className="text-[11px] font-bold text-[#FF3B5C]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {pct}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #FF3B5C, #FF0F3D)',
                boxShadow: '0 0 8px rgba(255,59,92,0.5)',
                transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div
              className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,59,92,0.08)', border: '1px solid rgba(255,59,92,0.15)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3B5C" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <p className="text-[14px] font-bold text-[#f0f0f5]" style={{ fontFamily: 'var(--font-display)' }}>
              All clear!
            </p>
            <p className="text-[13px] text-[#9099b0] leading-relaxed">
              No tasks for today. Add one to get started.
            </p>
          </div>
        ) : (
          <TaskListClient
            tasks={allTodayTasks}
            showProject={true}
            emptyTitle="All clear!"
            emptyDescription="No tasks for today."
            showToDoHeader
          />
        )}
      </div>
    </div>
  )
}
