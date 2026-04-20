'use client'
import { useState, useTransition, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import { cn, PRIORITY_LABEL, getTodayString } from '@/lib/utils'
import { ProjectDot } from './project-dot'
import { completeTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { UndoToast } from './undo-toast'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
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
  const [showUndo, setShowUndo] = useState(false)
  const [deletedId, setDeletedId] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const x = useMotionValue(0)

  const today = getTodayString()
  const isOverdue = !task.completed && task.due_date != null && task.due_date < today

  const formattedDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  function handleComplete() {
    startTransition(() => completeTask(task.id, !task.completed))
  }

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation()
    handleComplete()
  }

  function handleSwipeDelete() {
    setDeletedId(task.id)
    startTransition(() => softDeleteTask(task.id))
    setShowUndo(true)
  }

  function handleUndo() {
    if (deletedId) startTransition(() => restoreTask(deletedId))
    setShowUndo(false)
  }

  const handleExpire = useCallback(() => {
    if (deletedId) startTransition(() => hardDeleteTask(deletedId))
    setShowUndo(false)
  }, [deletedId])

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.x > 60) {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
      handleComplete()
    } else if (info.offset.x < -60) {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
      handleSwipeDelete()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    }
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Swipe-right reveal: complete */}
        <div className="absolute inset-0 flex items-center px-4 gap-2 rounded-xl"
             style={{ background: '#16a34a' }}>
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
          <span className="text-[11px] font-bold text-white">Complete</span>
        </div>

        {/* Swipe-left reveal: delete */}
        <div className="absolute inset-0 flex items-center justify-end px-4 gap-2 rounded-xl"
             style={{ background: '#dc2626' }}>
          <span className="text-[11px] font-bold text-white">Delete</span>
          <Trash2 className="w-4 h-4 text-white" />
        </div>

        {/* Row */}
        <motion.div
          layout
          style={{ x, background: 'var(--color-base, #080812)' }}
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: -120, right: 120 }}
          dragElastic={0.1}
          onDragEnd={isMobile ? handleDragEnd : undefined}
          onClick={onClick}
          className={cn(
            'group flex items-center gap-3 px-3.5 rounded-xl cursor-pointer relative',
            'transition-colors duration-150',
            'border border-transparent',
            task.completed
              ? 'opacity-40 hover:opacity-60'
              : 'hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]'
          )}
        >
          {/* Left accent bar on hover (desktop only) */}
          {!task.completed && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-5 bg-[#7C6FF7] rounded-r-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
          )}

          {/* Checkbox with 44px touch target */}
          <div
            className="flex items-center justify-center w-[44px] h-[44px] -ml-3 -my-1 flex-shrink-0"
            onClick={handleCheck}
          >
            <motion.div
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
            </motion.div>
          </div>

          {showProject && task.project && <ProjectDot color={task.project.color} />}

          <span className={cn(
            'flex-1 text-[13px] font-medium truncate py-3',
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
                {isOverdue ? 'Overdue' : formattedDate}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {showUndo && (
        <UndoToast message="Task deleted" onUndo={handleUndo} onExpire={handleExpire} />
      )}
    </>
  )
}
