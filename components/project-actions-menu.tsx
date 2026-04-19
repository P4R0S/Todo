'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react'
import { updateProject, deleteProject } from '@/lib/actions/projects'
import { cn } from '@/lib/utils'

const COLORS = ['#5E6AD2', '#34d399', '#f59e0b', '#f87171', '#38bdf8', '#a78bfa', '#fb7185', '#4ade80']

interface Props {
  projectId: string
  projectName: string
  projectColor: string
}

export function ProjectActionsMenu({ projectId, projectName, projectColor }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(projectName)
  const [color, setColor] = useState(projectColor)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleRename() {
    if (!name.trim() || (name === projectName && color === projectColor)) {
      setEditing(false)
      return
    }
    setLoading(true)
    await updateProject(projectId, { name: name.trim(), color })
    setLoading(false)
    setEditing(false)
    setOpen(false)
    router.refresh()
  }

  async function handleDelete() {
    setLoading(true)
    await deleteProject(projectId)
    router.push('/today')
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-5 h-5 rounded-full transition-all"
              style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }}
            />
          ))}
        </div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false) }}
          className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-1 text-[14px] text-[#ededef] outline-none focus:border-[#5E6AD2] w-36"
        />
        <button type="button" onClick={handleRename} disabled={loading} className="text-[#5E6AD2] hover:opacity-80">
          <Check className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-[#4a4f5a] hover:text-[#8a8f98]">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg text-[#4a4f5a] hover:text-[#8a8f98] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-[#13131a] border border-[rgba(255,255,255,0.08)] rounded-[10px] shadow-xl z-50 overflow-hidden">
          {!confirmDelete ? (
            <>
              <button
                type="button"
                onClick={() => { setEditing(true); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-[#ededef] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-[#8a8f98]" /> Rename
              </button>
              <div className="h-px bg-[rgba(255,255,255,0.06)]" />
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete project
              </button>
            </>
          ) : (
            <div className="p-3">
              <p className="text-[12px] text-[#8a8f98] mb-3">Delete <span className="text-[#ededef] font-medium">{projectName}</span> and all its tasks?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 text-[12px] rounded-lg border border-[rgba(255,255,255,0.08)] text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-1.5 text-[12px] rounded-lg bg-[#DC2626] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
