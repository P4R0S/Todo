'use client'
import { useState, useTransition, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, animate, type PanInfo } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { cn, PRIORITY_LABEL, getTodayString } from '@/lib/utils'
import { ProjectDot } from './project-dot'
import { completeTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { UndoToast } from './undo-toast'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import type { Task } from '@/lib/types'

const PRIORITY_PILL: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'rgba(248,113,113,0.1)',  text: '#f87171', border: 'rgba(248,113,113,0.25)' },
  high:   { bg: 'rgba(251,146,60,0.1)',   text: '#fb923c', border: 'rgba(251,146,60,0.25)'  },
  medium: { bg: 'rgba(251,191,36,0.1)',   text: '#fbbf24', border: 'rgba(251,191,36,0.25)'  },
  low:    { bg: 'rgba(56,189,248,0.1)',   text: '#38bdf8', border: 'rgba(56,189,248,0.25)'  },
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
  const [revealDir, setRevealDir] = useState<'none' | 'right' | 'left'>('none')
  const isMobile = useIsMobile()
  const x = useMotionValue(0)

  useMotionValueEvent(x, 'change', (val) => {
    if (val > 5) setRevealDir('right')
    else if (val < -5) setRevealDir('left')
    else setRevealDir('none')
  })

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

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    handleSwipeDelete()
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

  const pill = task.priority !== 'none' ? PRIORITY_PILL[task.priority] : null

  return (
    <>
      <div className="relative overflow-hidden rounded-[14px] mb-[3px]">
        {/* Swipe-right reveal: complete — only shown while swiping right */}
        {revealDir === 'right' && (
          <div
            className="absolute inset-0 flex items-center px-4 gap-2 rounded-[14px]"
            style={{ background: '#16a34a' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[11px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Done</span>
          </div>
        )}

        {/* Swipe-left reveal: delete — only shown while swiping left */}
        {revealDir === 'left' && (
          <div
            className="absolute inset-0 flex items-center justify-end px-4 gap-2 rounded-[14px]"
            style={{ background: '#dc2626' }}
          >
            <span className="text-[11px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Delete</span>
            <Trash2 className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Main row */}
        <motion.div
          layout
          style={{
            x,
            background: '#08080f',
          }}
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: -120, right: 120 }}
          dragElastic={0.1}
          onDragEnd={isMobile ? handleDragEnd : undefined}
          onClick={onClick}
          className={cn(
            'group flex items-center gap-2.5 px-3.5 rounded-[14px] cursor-pointer relative',
            'transition-colors duration-150',
            'min-h-[52px]',
            task.completed
              ? 'border border-[rgba(255,255,255,0.04)]'
              : 'border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)]'
          )}
        >
          {/* Checkbox — 44px touch target */}
          <div
            className="flex items-center justify-center w-[44px] h-[44px] -ml-2 flex-shrink-0"
            onClick={handleCheck}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                border: task.completed ? 'none' : '1.5px solid rgba(255,255,255,0.22)',
                background: task.completed ? '#FF3B5C' : 'transparent',
                boxShadow: task.completed ? '0 0 12px rgba(255,59,92,0.5)' : 'none',
              }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {showProject && task.project && (
            <ProjectDot color={task.project.color} />
          )}

          <span
            className="flex-1 text-[13.5px] font-medium truncate py-3 transition-colors duration-200"
            style={{ color: task.completed ? '#454a5c' : '#f0f0f5', textDecoration: task.completed ? 'line-through' : 'none' }}
          >
            {task.title}
          </span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!task.completed && pill && (
              <span
                className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: pill.bg,
                  color: pill.text,
                  border: `1px solid ${pill.border}`,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em',
                }}
              >
                {PRIORITY_LABEL[task.priority]}
              </span>
            )}
            {formattedDate && !task.completed && (
              <span
                className="text-[11px] font-medium"
                style={{ color: isOverdue ? '#f87171' : '#454a5c' }}
              >
                {isOverdue ? 'Late' : formattedDate}
              </span>
            )}
            {task.completed && (
              <button
                onClick={handleDeleteClick}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-[8px] flex-shrink-0 transition-all duration-150 hover:bg-[rgba(248,113,113,0.18)]"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.18)',
                }}
                aria-label="Remove task"
              >
                <Trash2 className="w-[13px] h-[13px]" style={{ color: '#f87171' }} />
              </button>
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
