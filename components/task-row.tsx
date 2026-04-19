'use client'
import { useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn, PRIORITY_LABEL, getTodayString } from '@/lib/utils'
import { ProjectDot } from './project-dot'
import { completeTask } from '@/lib/actions/tasks'
import type { Task } from '@/lib/types'

const PRIORITY_PILL: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-400 border border-red-500/20',
  high:   'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  low:    'bg-sky-500/10 text-sky-400 border border-sky-500/20',
}

interface TaskRowProps {
  task: Task & { project?: { name: string; color: string } }
  showProject?: boolean
  onClick: () => void
}

export function TaskRow({ task, showProject = false, onClick }: TaskRowProps) {
  const [pending, startTransition] = useTransition()

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => completeTask(task.id, !task.completed))
  }

  const today = getTodayString()
  const isOverdue = !task.completed && task.due_date != null && task.due_date < today

  const formattedDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer relative',
        'transition-all duration-150',
        'border border-transparent',
        task.completed
          ? 'opacity-40 hover:opacity-60'
          : 'hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]'
      )}
    >
      {/* Left accent bar on hover */}
      {!task.completed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-5 bg-[#7C6FF7] rounded-r-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
      )}

      {/* Checkbox */}
      <motion.button
        onClick={handleCheck}
        disabled={pending}
        whileTap={{ scale: 0.8 }}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-150',
          task.completed
            ? 'bg-[#7C6FF7] border-[#7C6FF7] shadow-[0_0_10px_rgba(124,111,247,0.5)]'
            : 'border-[rgba(255,255,255,0.18)] hover:border-[#7C6FF7] hover:bg-[rgba(124,111,247,0.1)]'
        )}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {showProject && task.project && <ProjectDot color={task.project.color} />}

      <span className={cn(
        'flex-1 text-[13px] font-medium truncate leading-none',
        task.completed ? 'line-through text-[#454a5c]' : 'text-[#d8dce8]'
      )}>
        {task.title}
      </span>

      <div className="flex items-center gap-2 flex-shrink-0">
        {task.priority !== 'none' && PRIORITY_PILL[task.priority] && (
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide', PRIORITY_PILL[task.priority])}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        )}
        {formattedDate && !task.completed && (
          <span className={cn(
            'text-[11px] font-medium',
            isOverdue ? 'text-red-400' : 'text-[#454a5c]'
          )}>
            {isOverdue ? '⚠ Overdue' : formattedDate}
          </span>
        )}
      </div>
    </motion.div>
  )
}
