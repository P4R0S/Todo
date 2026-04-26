import { getAllTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import Link from 'next/link'
import { getTodayString } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default async function ProjectsPage() {
  const [tasks, projects] = await Promise.all([getAllTasks(), getProjects()])
  const today = getTodayString()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-0 flex items-start justify-between flex-shrink-0">
        <div>
          <h1
            className="text-[26px] font-extrabold text-[#f0f0f5] leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Projects
          </h1>
          <p className="text-[12px] text-[#454a5c] mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-semibold text-[#FF3B5C] border border-[rgba(255,59,92,0.25)] bg-[rgba(255,59,92,0.08)] hover:bg-[rgba(255,59,92,0.14)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          New
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-[10px]">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[15px] font-bold text-[#f0f0f5] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              No projects yet
            </p>
            <p className="text-[13px] text-[#9099b0]">Create a project to start organizing tasks.</p>
          </div>
        ) : (
          projects.map(proj => {
            const ptasks = tasks.filter(t => t.project_id === proj.id)
            const done = ptasks.filter(t => t.completed).length
            const pct = ptasks.length ? Math.round((done / ptasks.length) * 100) : 0
            const overdue = ptasks.filter(t => !t.completed && t.due_date && t.due_date < today).length

            return (
              <Link key={proj.id} href={`/projects/${proj.id}`} className="block group">
                <div
                  className="rounded-2xl p-4 flex flex-col gap-3 border transition-colors duration-150 group-hover:border-[rgba(255,255,255,0.1)] group-hover:bg-[rgba(255,255,255,0.035)]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                        style={{ background: `${proj.color}18`, border: `1px solid ${proj.color}30` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: proj.color, boxShadow: `0 0 8px ${proj.color}` }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[15px] font-bold text-[#f0f0f5]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {proj.name}
                        </p>
                        <p className="text-[11px] text-[#454a5c] mt-0.5">
                          {ptasks.length} task{ptasks.length !== 1 ? 's' : ''} · {done} done
                        </p>
                      </div>
                    </div>
                    {overdue > 0 && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          color: '#f87171',
                          background: 'rgba(248,113,113,0.1)',
                          border: '1px solid rgba(248,113,113,0.2)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {overdue} late
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between mb-[5px]">
                      <span className="text-[10px] text-[#454a5c]">{pct}% complete</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: proj.color,
                          boxShadow: `0 0 6px ${proj.color}80`,
                          transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
