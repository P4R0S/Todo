import { getAllTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { getTodayString } from '@/lib/utils'
import { StatsRing } from '@/components/stats-ring'

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: '#f87171' },
  high:   { label: 'High',   color: '#fb923c' },
  medium: { label: 'Medium', color: '#fbbf24' },
  low:    { label: 'Low',    color: '#38bdf8' },
}

export default async function StatsPage() {
  const [tasks, projects] = await Promise.all([getAllTasks(), getProjects()])
  const today = getTodayString()

  const total     = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const overdue   = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length
  const dueToday  = tasks.filter(t => t.due_date === today).length
  const pct       = total ? Math.round((completed / total) * 100) : 0

  const priorityCounts = Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    color: cfg.color,
    count: tasks.filter(t => t.priority === key && !t.completed).length,
  })).filter(p => p.count > 0)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-0 flex-shrink-0">
        <h1
          className="text-[26px] font-extrabold text-[#f0f0f5] leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Stats
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Animated ring + overview */}
        <StatsRing pct={pct} total={total} completed={completed} overdue={overdue} dueToday={dueToday} />

        {/* By project */}
        {projects.length > 0 && (
          <div>
            <p
              className="text-[11px] font-bold text-[#454a5c] uppercase mb-2"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
            >
              By Project
            </p>
            <div className="space-y-2">
              {projects.map(proj => {
                const pt  = tasks.filter(t => t.project_id === proj.id)
                const pd  = pt.filter(t => t.completed).length
                const pp  = pt.length ? Math.round((pd / pt.length) * 100) : 0
                return (
                  <div
                    key={proj.id}
                    className="rounded-[14px] px-3.5 py-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: proj.color, boxShadow: `0 0 6px ${proj.color}80` }}
                        />
                        <span className="text-[13px] font-semibold text-[#f0f0f5]">{proj.name}</span>
                      </div>
                      <span className="text-[11px] text-[#9099b0]">{pd}/{pt.length}</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pp}%`,
                          background: proj.color,
                          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Priority breakdown */}
        {priorityCounts.length > 0 && (
          <div>
            <p
              className="text-[11px] font-bold text-[#454a5c] uppercase mb-2"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
            >
              Open by Priority
            </p>
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {priorityCounts.map((p, i) => (
                <div
                  key={p.key}
                  className="flex items-center gap-3 px-3.5 py-2.5"
                  style={{ borderBottom: i < priorityCounts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                >
                  <span
                    className="text-[10px] font-bold w-11"
                    style={{ color: p.color, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                  >
                    {p.label}
                  </span>
                  <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full opacity-70"
                      style={{ width: `${total ? (p.count / total) * 100 : 0}%`, background: p.color }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-bold text-[#9099b0] w-4 text-right"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}
