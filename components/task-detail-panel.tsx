'use client'
import { useState, useTransition, useEffect, useCallback } from 'react'
import { X, Trash2, Plus, Check } from 'lucide-react'
import { cn, PRIORITY_LABEL } from '@/lib/utils'
import { updateTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { createSubtask, updateSubtask, deleteSubtask } from '@/lib/actions/subtasks'
import { UndoToast } from './undo-toast'
import type { TaskWithSubtasks, Priority } from '@/lib/types'

interface TaskDetailPanelProps {
  task: TaskWithSubtasks | null
  onClose: () => void
}

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high', 'urgent']

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [newSubtask, setNewSubtask] = useState('')
  const [showUndo, setShowUndo] = useState(false)
  const [deletedTaskId, setDeletedTaskId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

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

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <aside className="fixed right-0 top-0 h-full w-[360px] z-40 bg-[#0d0d14] border-l border-[rgba(255,255,255,0.06)] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-[13px] text-[#8a8f98]">Task details</span>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="text-[#4a4f5a] hover:text-red-400 transition-colors p-1" aria-label="Delete task">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-[#4a4f5a] hover:text-[#8a8f98] transition-colors p-1" aria-label="Close panel">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => title.trim() && save({ title: title.trim() })}
            className="w-full bg-transparent text-[16px] font-semibold text-[#ededef] outline-none placeholder:text-[#4a4f5a]"
            placeholder="Task title"
          />

          <div>
            <p className="text-[10px] text-[#4a4f5a] uppercase tracking-[0.8px] mb-2">Priority</p>
            <div className="flex gap-1.5 flex-wrap">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => { setPriority(p); save({ priority: p }) }}
                  className={cn(
                    'text-[11px] px-2.5 py-1 rounded-lg border transition-all duration-150',
                    priority === p
                      ? 'bg-[rgba(94,106,210,0.2)] border-[#5E6AD2] text-[#a5aaee]'
                      : 'bg-transparent border-[rgba(255,255,255,0.06)] text-[#4a4f5a] hover:border-[rgba(255,255,255,0.12)]'
                  )}
                >
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#4a4f5a] uppercase tracking-[0.8px] mb-2">Due date</p>
            <input
              type="date"
              value={dueDate}
              onChange={e => { setDueDate(e.target.value); save({ due_date: e.target.value || null }) }}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] text-[#ededef] outline-none focus:border-[#5E6AD2] transition-colors w-full"
            />
          </div>

          <div>
            <p className="text-[10px] text-[#4a4f5a] uppercase tracking-[0.8px] mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => save({ notes: notes || null })}
              placeholder="Add notes…"
              rows={3}
              className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] text-[#ededef] placeholder:text-[#4a4f5a] outline-none focus:border-[#5E6AD2] transition-colors resize-none"
            />
          </div>

          <div>
            <p className="text-[10px] text-[#4a4f5a] uppercase tracking-[0.8px] mb-2">Subtasks</p>
            <div className="space-y-1.5 mb-2">
              {[...task.subtasks]
                .sort((a, b) => a.position - b.position)
                .map(st => (
                  <div key={st.id} className="flex items-center gap-2 group/st">
                    <button
                      onClick={() => startTransition(() => updateSubtask(st.id, { completed: !st.completed }))}
                      className={cn(
                        'w-3.5 h-3.5 rounded-[3px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-150',
                        st.completed ? 'bg-[#5E6AD2] border-[#5E6AD2]' : 'border-[rgba(255,255,255,0.15)] hover:border-[#5E6AD2]'
                      )}
                    >
                      {st.completed && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                    </button>
                    <span className={cn('flex-1 text-[12px]', st.completed ? 'line-through text-[#4a4f5a]' : 'text-[#8a8f98]')}>
                      {st.title}
                    </span>
                    <button
                      onClick={() => startTransition(() => deleteSubtask(st.id))}
                      className="opacity-0 group-hover/st:opacity-100 text-[#4a4f5a] hover:text-red-400 transition-all"
                      aria-label="Delete subtask"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#4a4f5a] flex-shrink-0" />
              <input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={handleAddSubtask}
                placeholder="Add subtask… (Enter to save)"
                className="flex-1 bg-transparent text-[12px] text-[#ededef] placeholder:text-[#4a4f5a] outline-none"
              />
            </div>
          </div>
        </div>
      </aside>

      {showUndo && (
        <UndoToast message="Task deleted" onUndo={handleUndo} onExpire={handleExpire} />
      )}
    </>
  )
}
