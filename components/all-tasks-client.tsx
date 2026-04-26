'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TaskRow } from './task-row'
import { TaskDetailPanel } from './task-detail-panel'
import { sortTasks } from '@/lib/utils'
import type { Project, TaskWithSubtasks } from '@/lib/types'

type Task = TaskWithSubtasks & { project?: { id: string; name: string; color: string } }
type Filter = 'all' | 'active' | 'completed'

interface AllTasksClientProps {
  tasks: Task[]
  projects: Project[]
}

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export function AllTasksClient({ tasks, projects }: AllTasksClientProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedTask, setSelectedTask] = useState<TaskWithSubtasks | null>(null)

  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
  )

  const byProject = projects
    .map(p => ({ project: p, tasks: filtered.filter(t => t.project_id === p.id) }))
    .filter(g => g.tasks.length > 0)

  return (
    <>
      {/* Filter tabs */}
      <div
        className="flex gap-1.5 p-1 rounded-xl mb-2"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className="flex-1 py-[7px] rounded-[9px] text-[12px] font-bold capitalize transition-all duration-200"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
              background: filter === tab.id ? 'rgba(124,111,247,0.18)' : 'transparent',
              color: filter === tab.id ? '#7C6FF7' : '#454a5c',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {byProject.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-[15px] font-bold text-[#f0f0f5]" style={{ fontFamily: 'var(--font-display)' }}>
            {filter === 'completed' ? 'Nothing completed yet' : 'No tasks'}
          </p>
          <p className="text-[13px] text-[#9099b0] mt-1">
            {filter === 'active' ? 'All caught up!' : 'Add a task to get started.'}
          </p>
        </div>
      ) : (
        byProject.map(({ project, tasks: ptasks }) => {
          const sorted = filter === 'active'
            ? sortTasks(ptasks)
            : filter === 'completed'
              ? ptasks.sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))
              : [...sortTasks(ptasks.filter(t => !t.completed)), ...ptasks.filter(t => t.completed)]
          return (
            <div key={project.id}>
              <div className="flex items-center gap-2 pt-4 pb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.color, boxShadow: `0 0 6px ${project.color}99` }}
                />
                <span
                  className="text-[11px] font-bold text-[#454a5c] uppercase"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
                >
                  {project.name}
                </span>
                <span
                  className="text-[10px] font-bold text-[#454a5c] px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {ptasks.length}
                </span>
              </div>
              <div className="space-y-[3px]">
                {sorted.map(t => (
                  <TaskRow key={t.id} task={t} showProject={false} onClick={() => setSelectedTask(t)} />
                ))}
              </div>
            </div>
          )
        })
      )}

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
