'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit:   { opacity: 0, y: -4, transition: { duration: 0.2 } },
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
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-0.5"
      >
        <AnimatePresence mode="popLayout">
          {incomplete.map(t => (
            <motion.div key={t.id} variants={itemVariants} exit="exit" layout>
              <TaskRow task={t} showProject={showProject} onClick={() => setSelectedTask(t)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {incomplete.length === 0 && completed.length === 0 && (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}

        {completed.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: incomplete.length * 0.04 + 0.1 }}
          >
            <p className="text-[10px] text-[#454a5c] uppercase tracking-[1px] mt-5 mb-1.5 px-1 font-semibold"
               style={{ fontFamily: 'var(--font-display)' }}>
              Completed
            </p>
            <div className="space-y-0.5">
              {completed.map(t => (
                <TaskRow key={t.id} task={t} showProject={showProject} onClick={() => setSelectedTask(t)} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {projectId && (
        <div className="mt-3">
          <QuickAdd placeholder={quickAddPlaceholder} onAdd={handleAdd} />
        </div>
      )}

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
