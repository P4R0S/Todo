'use client'
import { useState, useTransition, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { X, Trash2, Plus, Check } from 'lucide-react'
import { cn, PRIORITY_LABEL } from '@/lib/utils'
import { updateTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { createSubtask, updateSubtask, deleteSubtask } from '@/lib/actions/subtasks'
import { UndoToast } from './undo-toast'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import type { TaskWithSubtasks, Priority } from '@/lib/types'

interface TaskDetailPanelProps {
  task: TaskWithSubtasks | null
  onClose: () => void
}

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high', 'urgent']

const PRIORITY_ACTIVE: Record<Priority, string> = {
  none:   'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.2)] text-[#f0f0f5]',
  low:    'bg-sky-500/15 border-sky-500/40 text-sky-300',
  medium: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
  high:   'bg-orange-500/15 border-orange-500/40 text-orange-300',
  urgent: 'bg-red-500/15 border-red-500/40 text-red-300',
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [newSubtask, setNewSubtask] = useState('')
  const [showUndo, setShowUndo] = useState(false)
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!task) return
    setTitle(task.title)
    setNotes(task.notes ?? '')
    setDueDate(task.due_date ?? '')
    setPriority(task.priority)
  }, [task?.id])

  const handleExpire = useCallback(() => {
    if (deletedTaskId) startTransition(() => hardDeleteTask(deletedTaskId))
    setShowUndo(false)
  }, [deletedTaskId])

  if (!task) return null

  function save(field: object) {
    startTransition(() => updateTask(task!.id, field))
  }

  function handleDelete() {
    setDeletedTaskId(task!.id)
    startTransition(() => softDeleteTask(task!.id))
    setShowUndo(true)
    onClose()
  }

  function handleUndo() {
    if (deletedTaskId) startTransition(() => restoreTask(deletedTaskId))
    setShowUndo(false)
  }

  async function handleAddSubtask(e: React.KeyboardEvent) {
    if (e.key !== 'Enter' || !newSubtask.trim()) return
    e.preventDefault()
    const pos = task!.subtasks.length
    await createSubtask(task!.id, newSubtask.trim(), pos)
    setNewSubtask('')
  }

  function handleSheetDragEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.y > 80) onClose()
  }

  const panelContent = (
    <>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => title.trim() && save({ title: title.trim() })}
        className="w-full bg-transparent text-[17px] font-semibold text-[#f0f0f5] outline-none placeholder:text-[#454a5c] leading-snug"
        placeholder="Task title"
      />

      <div>
        <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
           style={{ fontFamily: 'var(--font-display)' }}>Priority</p>
        <div className="flex gap-1.5 flex-wrap">
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => { setPriority(p); save({ priority: p }) }}
              className={cn(
                'text-[11px] px-3 py-1.5 rounded-lg border font-semibold tracking-wide transition-all duration-150',
                priority === p
                  ? PRIORITY_ACTIVE[p]
                  : 'bg-transparent border-[rgba(255,255,255,0.06)] text-[#454a5c] hover:border-[rgba(255,255,255,0.12)] hover:text-[#9099b0]'
              )}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
           style={{ fontFamily: 'var(--font-display)' }}>Due Date</p>
        <input
          type="date"
          value={dueDate}
          onChange={e => { setDueDate(e.target.value); save({ due_date: e.target.value || null }) }}
          className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] font-medium text-[#f0f0f5] outline-none focus:border-[rgba(255,59,92,0.5)] focus:bg-[rgba(255,59,92,0.05)] transition-all w-full"
        />
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
           style={{ fontFamily: 'var(--font-display)' }}>Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={() => save({ notes: notes || null })}
          placeholder="Add notes..."
          rows={3}
          className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[13px] text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(255,59,92,0.5)] focus:bg-[rgba(255,59,92,0.05)] transition-all resize-none font-medium"
        />
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
           style={{ fontFamily: 'var(--font-display)' }}>Subtasks</p>
        <div className="space-y-1 mb-3">
          {[...task.subtasks]
            .sort((a, b) => a.position - b.position)
            .map(st => (
              <div key={st.id} className="flex items-center gap-2.5 py-1">
                <button
                  onClick={() => startTransition(() => updateSubtask(st.id, { completed: !st.completed }))}
                  className={cn(
                    'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150',
                    st.completed
                      ? 'bg-[#FF3B5C] border-[#FF3B5C] shadow-[0_0_6px_rgba(255,59,92,0.4)]'
                      : 'border-[rgba(255,255,255,0.18)] hover:border-[#FF3B5C]'
                  )}
                >
                  {st.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </button>
                <span className={cn(
                  'flex-1 text-[12px] font-medium',
                  st.completed ? 'line-through text-[#454a5c]' : 'text-[#9099b0]'
                )}>
                  {st.title}
                </span>
                <button
                  onClick={() => startTransition(() => deleteSubtask(st.id))}
                  className="p-1 text-[#454a5c] hover:text-[#f87171] transition-all"
                  aria-label="Delete subtask"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full border border-dashed border-[rgba(255,255,255,0.12)] flex items-center justify-center flex-shrink-0">
            <Plus className="w-2.5 h-2.5 text-[#454a5c]" />
          </div>
          <input
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            onKeyDown={handleAddSubtask}
            placeholder="Add subtask... (Enter to save)"
            className="flex-1 bg-transparent text-[12px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none"
          />
        </div>
      </div>
    </>
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.25 }}
          onDragEnd={handleSheetDragEnd}
          transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.8 }}
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-[20px] border-t border-[rgba(255,255,255,0.08)] max-h-[85vh]"
          style={{ background: 'rgba(8,8,18,0.98)', backdropFilter: 'blur(40px) saturate(180%)' }}
        >
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-8 h-[3px] rounded-full bg-[rgba(255,255,255,0.2)]" />
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
            <span className="text-[11px] font-semibold text-[#454a5c] uppercase tracking-[1px]"
                  style={{ fontFamily: 'var(--font-display)' }}>
              Task Details
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handleDelete}
                className="p-2 rounded-lg text-[#454a5c] hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] transition-all"
                aria-label="Delete task">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={onClose}
                className="p-2 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all"
                aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-8">
            {panelContent}
          </div>
        </motion.div>
      ) : (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.8 }}
          className="fixed right-0 top-0 h-full w-[380px] z-40 flex flex-col border-l border-[rgba(255,255,255,0.06)]"
          style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(40px) saturate(180%)' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[11px] font-semibold text-[#454a5c] uppercase tracking-[1px]"
                  style={{ fontFamily: 'var(--font-display)' }}>
              Task Details
            </span>
            <div className="flex items-center gap-1">
              <button onClick={handleDelete}
                className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] transition-all"
                aria-label="Delete task">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={onClose}
                className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all"
                aria-label="Close">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {panelContent}
          </div>
        </motion.aside>
      )}

      {showUndo && (
        <UndoToast message="Task deleted" onUndo={handleUndo} onExpire={handleExpire} />
      )}
    </>
  )
}
