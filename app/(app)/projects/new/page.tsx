'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const COLORS = [
  '#FF3B5C', '#34d399', '#f59e0b', '#f87171',
  '#38bdf8', '#a78bfa', '#fb7185', '#4ade80',
]

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#FF3B5C')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const project = await createProject({ name: name.trim(), color })
    router.push(`/projects/${project.id}`)
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl p-[1px]"
             style={{ background: 'linear-gradient(135deg, rgba(255,59,92,0.2), rgba(255,255,255,0.04), rgba(255,15,61,0.1))' }}>
          <div className="rounded-[15px] p-6"
               style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(40px)' }}>
            <h1 className="text-[18px] font-bold mb-1 tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}>New Project</h1>
            <p className="text-[12px] text-[#9099b0] mb-5 font-medium">Organize your tasks with a project</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-[#454a5c] mb-2 tracking-[1px] uppercase"
                       style={{ fontFamily: 'var(--font-display)' }}>
                  Name
                </label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Work, University…"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#454a5c] mb-3 tracking-[1px] uppercase"
                       style={{ fontFamily: 'var(--font-display)' }}>
                  Color
                </label>
                <div className="flex gap-2.5 flex-wrap">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full transition-all duration-150 hover:scale-110"
                      style={{
                        background: c,
                        outline: color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '3px',
                        boxShadow: color === c ? `0 0 10px ${c}60` : 'none',
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {name && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                  <span className="text-[13px] font-semibold text-[#f0f0f5]">{name}</span>
                </motion.div>
              )}

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !name.trim()} className="flex-1">
                  {loading ? 'Creating…' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
