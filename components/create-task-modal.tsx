'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { createTask } from '@/lib/actions/tasks'
import { cn } from '@/lib/utils'
import type { Project, Priority } from '@/lib/types'

const PRIORITIES: { value: Priority; label: string; style: string }[] = [
  { value: 'none',   label: 'None',   style: 'border-[rgba(255,255,255,0.08)] text-[#454a5c]' },
  { value: 'low',    label: 'Low',    style: 'border-sky-500/30 text-sky-400' },
  { value: 'medium', label: 'Medium', style: 'border-yellow-500/30 text-yellow-400' },
  { value: 'high',   label: 'High',   style: 'border-orange-500/30 text-orange-400' },
  { value: 'urgent', label: 'Urgent', style: 'border-red-500/30 text-red-400' },
]

const PRIORITY_ACTIVE: Record<Priority, string> = {
  none:   'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.2)] text-[#f0f0f5]',
  low:    'bg-sky-500/15 border-sky-500/50 text-sky-300',
  medium: 'bg-yellow-500/15 border-yellow-500/50 text-yellow-300',
  high:   'bg-orange-500/15 border-orange-500/50 text-orange-300',
  urgent: 'bg-red-500/15 border-red-500/50 text-red-300',
}

interface CreateTaskModalProps {
  projects: Project[]
  defaultProjectId?: string
  buttonLabel?: string
  trigger?: React.ReactNode
}

export function CreateTaskModal({ projects, defaultProjectId, buttonLabel = 'Add Task', trigger }: CreateTaskModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? '')
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => titleRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleClose() {
    setOpen(false)
    setTitle('')
    setPriority('none')
    setDueDate('')
    setNotes('')
    setProjectId(defaultProjectId ?? projects[0]?.id ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !projectId) return
    setLoading(true)
    await createTask({
      project_id: projectId,
      title: title.trim(),
      priority,
      due_date: dueDate || undefined,
      notes: notes.trim() || undefined,
    })
    setLoading(false)
    handleClose()
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} style={{ display: 'contents' }}>{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[12px] font-bold text-white transition-all duration-150 hover:opacity-90 hover:shadow-[0_0_28px_rgba(124,111,247,0.5)]"
          style={{ background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)', boxShadow: '0 0 20px rgba(124,111,247,0.3)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          {buttonLabel}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.7 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] px-4"
            >
              <div className="rounded-2xl p-[1px]"
                   style={{ background: 'linear-gradient(135deg, rgba(124,111,247,0.3), rgba(255,255,255,0.05), rgba(94,158,247,0.15))' }}>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-[15px] p-5 flex flex-col gap-5"
                  style={{ background: 'rgba(8,8,18,0.97)', backdropFilter: 'blur(40px)' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-bold tracking-tight text-[#f0f0f5]"
                        style={{ fontFamily: 'var(--font-display)' }}>
                      New Task
                    </h2>
                    <button type="button" onClick={handleClose}
                      className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <input
                    ref={titleRef}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[15px] font-semibold text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all"
                  />

                  {/* Project */}
                  {projects.length > 1 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
                         style={{ fontFamily: 'var(--font-display)' }}>Project</p>
                      <div className="flex flex-wrap gap-1.5">
                        {projects.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setProjectId(p.id)}
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-150',
                              projectId === p.id
                                ? 'border-[rgba(255,255,255,0.2)] text-[#f0f0f5]'
                                : 'border-[rgba(255,255,255,0.06)] text-[#454a5c] hover:text-[#9099b0] hover:border-[rgba(255,255,255,0.12)]'
                            )}
                            style={projectId === p.id ? { background: `${p.color}18` } : undefined}
                          >
                            <span className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: p.color, boxShadow: projectId === p.id ? `0 0 5px ${p.color}80` : 'none' }} />
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Priority */}
                  <div>
                    <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
                       style={{ fontFamily: 'var(--font-display)' }}>Priority</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {PRIORITIES.map(({ value, label, style }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPriority(value)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition-all duration-150',
                            priority === value ? PRIORITY_ACTIVE[value] : `bg-transparent ${style} hover:bg-[rgba(255,255,255,0.03)]`
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due date */}
                  <div>
                    <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
                       style={{ fontFamily: 'var(--font-display)' }}>Due Date <span className="normal-case tracking-normal font-medium text-[#454a5c]">(optional)</span></p>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#f0f0f5] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
                       style={{ fontFamily: 'var(--font-display)' }}>Notes <span className="normal-case tracking-normal font-medium text-[#454a5c]">(optional)</span></p>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Any extra details…"
                      rows={2}
                      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[13px] font-semibold text-[#9099b0] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !title.trim() || !projectId}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all disabled:opacity-40 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)', boxShadow: '0 0 20px rgba(124,111,247,0.3)' }}
                    >
                      {loading ? 'Creating…' : 'Create Task'}
                    </button>
                  </div>

                  {projects.length === 0 && (
                    <p className="text-[12px] text-[#f87171] text-center font-medium">
                      Create a project first to add tasks.
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
