'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { useSearch } from '@/lib/contexts/search-context'
import { TaskDetailPanel } from './task-detail-panel'
import { getTodayString } from '@/lib/utils'
import type { TaskWithSubtasks } from '@/lib/types'

type Task = TaskWithSubtasks & { project?: { id: string; name: string; color: string } }

const PRIORITY_PILL: Record<string, { text: string; bg: string; border: string }> = {
  urgent: { text: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  high:   { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
  medium: { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  },
  low:    { text: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.25)'  },
}

const PRIORITY_LABEL: Record<string, string> = {
  urgent: 'Urgent', high: 'High', medium: 'Med', low: 'Low',
}

function scoreTask(task: Task, query: string): number {
  const q = query.toLowerCase()
  const title = task.title.toLowerCase()
  const notes = (task.notes ?? '').toLowerCase()
  if (title.startsWith(q)) return 3
  if (title.includes(q)) return 2
  if (notes.includes(q)) return 1
  return 0
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm"
            style={{ background: 'rgba(124,111,247,0.28)', color: '#a89cf9', fontStyle: 'normal' }}
          >
            {part}
          </mark>
        ) : part
      )}
    </>
  )
}

interface SearchModalProps {
  tasks: Task[]
}

export function SearchModal({ tasks }: SearchModalProps) {
  const { isOpen, openSearch, closeSearch } = useSearch()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [detailTask, setDetailTask] = useState<TaskWithSubtasks | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const today = getTodayString()

  // Keyboard shortcut — always active
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        isOpen ? closeSearch() : openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, openSearch, closeSearch])

  // Reset query on open, focus input
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const results = query.trim()
    ? tasks
        .map(t => ({ task: t, score: scoreTask(t, query.trim()) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score || a.task.title.localeCompare(b.task.title))
        .map(r => r.task)
    : []

  // Clamp selection when results change
  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { closeSearch(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && results[selectedIdx]) {
      openTask(results[selectedIdx])
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIdx])

  const openTask = useCallback((task: Task) => {
    closeSearch()
    setDetailTask(task as TaskWithSubtasks)
  }, [closeSearch])

  return (
    <>
      {/* Search overlay + modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={closeSearch}
            />

            {/* Modal */}
            <motion.div
              key="search-modal"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-50 left-1/2 -translate-x-1/2 w-full max-w-[560px] px-4"
              style={{ top: 'clamp(48px, 12vh, 120px)' }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(8,8,18,0.98)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(124,111,247,0.12)',
                }}
              >
                {/* Input row */}
                <div
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Search className="w-5 h-5 text-[#454a5c] flex-shrink-0" strokeWidth={2} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search tasks…"
                    className="flex-1 bg-transparent outline-none text-[15px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c]"
                  />
                  {query ? (
                    <button
                      onClick={() => { setQuery(''); inputRef.current?.focus() }}
                      className="text-[#454a5c] hover:text-[#9099b0] transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <span
                      className="text-[10px] font-bold text-[#454a5c] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)] flex-shrink-0 hidden sm:block"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ⌘K
                    </span>
                  )}
                </div>

                {/* Results */}
                <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                  {query.trim() === '' ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                        style={{ background: 'rgba(124,111,247,0.08)', border: '1px solid rgba(124,111,247,0.15)' }}
                      >
                        <Search className="w-5 h-5 text-[#7C6FF7]" strokeWidth={1.5} />
                      </div>
                      <p className="text-[13px] font-semibold text-[#9099b0] text-center">
                        Search across all your tasks
                      </p>
                      <p className="text-[11px] text-[#454a5c] mt-1 text-center">
                        Type to search by title or notes
                      </p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <p className="text-[13px] font-semibold text-[#9099b0]">No tasks found</p>
                      <p className="text-[11px] text-[#454a5c] mt-1">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="py-1.5">
                      {results.map((task, idx) => {
                        const isSelected = idx === selectedIdx
                        const pill = task.priority !== 'none' ? PRIORITY_PILL[task.priority] : null
                        const isOverdue = !task.completed && task.due_date && task.due_date < today
                        const dateLabel = task.due_date
                          ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : null

                        return (
                          <div
                            key={task.id}
                            data-idx={idx}
                            onClick={() => openTask(task)}
                            onMouseEnter={() => setSelectedIdx(idx)}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
                            style={{
                              background: isSelected ? 'rgba(124,111,247,0.1)' : 'transparent',
                              borderLeft: isSelected ? '2px solid #7C6FF7' : '2px solid transparent',
                            }}
                          >
                            {/* Project color dot */}
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                background: task.project?.color ?? '#454a5c',
                                boxShadow: task.project?.color ? `0 0 6px ${task.project.color}80` : 'none',
                              }}
                            />

                            {/* Title + project name */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[13.5px] font-medium truncate"
                                style={{
                                  color: task.completed ? '#454a5c' : '#f0f0f5',
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                }}
                              >
                                <HighlightedText text={task.title} query={query} />
                              </p>
                              {task.project && (
                                <p className="text-[11px] text-[#454a5c] mt-0.5 truncate">
                                  {task.project.name}
                                </p>
                              )}
                            </div>

                            {/* Meta */}
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
                              {dateLabel && !task.completed && (
                                <span
                                  className="text-[11px] font-medium"
                                  style={{ color: isOverdue ? '#f87171' : '#454a5c' }}
                                >
                                  {isOverdue ? 'Late' : dateLabel}
                                </span>
                              )}
                              {task.completed && (
                                <span className="text-[10px] text-[#454a5c]">Done</span>
                              )}
                              {isSelected && (
                                <CornerDownLeft className="w-3.5 h-3.5 text-[#7C6FF7] ml-1" strokeWidth={2} />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                {results.length > 0 && (
                  <div
                    className="flex items-center gap-3 px-4 py-2 hidden sm:flex"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    {[
                      ['↑↓', 'navigate'],
                      ['↵', 'open'],
                      ['esc', 'close'],
                    ].map(([key, label]) => (
                      <div key={key} className="flex items-center gap-1">
                        <kbd
                          className="text-[10px] text-[#454a5c] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {key}
                        </kbd>
                        <span className="text-[10px] text-[#454a5c]">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Task detail panel — opens after search closes */}
      <AnimatePresence>
        {detailTask && (
          <TaskDetailPanel task={detailTask} onClose={() => setDetailTask(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
