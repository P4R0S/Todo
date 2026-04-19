'use client'
import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAddProps {
  placeholder?: string
  onAdd: (title: string) => Promise<void>
}

export function QuickAdd({ placeholder = 'Add a task...', onAdd }: QuickAddProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      setLoading(true)
      await onAdd(value.trim())
      setValue('')
      setLoading(false)
    }
    if (e.key === 'Escape') {
      setValue('')
      inputRef.current?.blur()
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border transition-all duration-150 cursor-text',
        focused
          ? 'bg-[rgba(94,106,210,0.05)] border-[rgba(94,106,210,0.25)]'
          : 'bg-[rgba(255,255,255,0.02)] border-dashed border-[rgba(94,106,210,0.2)] hover:border-[rgba(94,106,210,0.35)]'
      )}
    >
      <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-dashed border-[rgba(94,106,210,0.4)] flex items-center justify-center flex-shrink-0">
        <Plus className="w-2.5 h-2.5 text-[#5E6AD2]" />
      </div>
      <input
        ref={inputRef}
        id="quick-add-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[13px] text-[#ededef] placeholder:text-[#4a4f5a] outline-none"
      />
    </div>
  )
}
