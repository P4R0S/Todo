'use client'
import { useState } from 'react'
import { TaskRow } from './task-row'
import { TaskDetailPanel } from './task-detail-panel'
import { QuickAdd } from './quick-add'
import { EmptyState } from './empty-state'
import { createTask } from '@/lib/actions/tasks'
import { sortTasks } from '@/lib/utils'
import type { TaskWithSubtasks } from '@/lib/types'

interface TaskListClientProps {
  tasks: (TaskWithSubtasks & { project?: { name: string; color: string } })[]
  projectId?: string
  showProject?: boolean
  emptyTitle: string
  emptyDescription: string
  quickAddPlaceholder?: string
}

export function TaskListClient({
  tasks, projectId, showProject = false,
  emptyTitle, emptyDescription, quickAddPlaceholder,
}: TaskListClientProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithSubtasks | null>(null)

  const incomplete = sortTasks(tasks.filter(t => !t.completed))
  const completed = [...tasks.filter(t => t.completed)]
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))

  async function handleAdd(title: string) {
    if (!projectId) return
    await createTask({ project_id: projectId, title })
  }

  if (tasks.length === 0 && !projectId) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <>
      <div className="space-y-1.5">
        {incomplete.map(t => (
          <TaskRow key={t.id} task={t} showProject={showProject} onClick={() => setSelectedTask(t)} />
        ))}
        {incomplete.length === 0 && completed.length === 0 && (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
        {completed.length > 0 && (
          <>
            <p className="text-[10px] text-[#4a4f5a] uppercase tracking-[0.8px] mt-4 mb-1.5">Completed</p>
            {completed.map(t => (
              <TaskRow key={t.id} task={t} showProject={showProject} onClick={() => setSelectedTask(t)} />
            ))}
          </>
        )}
      </div>

      {projectId && (
        <div className="mt-3">
          <QuickAdd placeholder={quickAddPlaceholder} onAdd={handleAdd} />
        </div>
      )}

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  )
}
