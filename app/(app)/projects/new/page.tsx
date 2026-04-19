'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const COLORS = ['#5E6AD2', '#34d399', '#f59e0b', '#f87171', '#38bdf8', '#a78bfa', '#fb7185', '#4ade80']

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#5E6AD2')
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
      <div className="w-full max-w-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
        <h1 className="text-[17px] font-semibold mb-5">New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs mb-1 block">Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Work, University…"
              autoFocus
              required
            />
          </div>
          <div>
            <Label className="text-xs mb-2 block">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all duration-150"
                  style={{
                    background: c,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="flex-1">
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
