'use client'
import { useState, useRef } from 'react'
import { Plus, CornerDownLeft } from 'lucide-react'
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

  async function handleSubmit() {
    if (!value.trim() || loading) return
    setLoading(true)
    await onAdd(value.trim())
    setValue('')
    setLoading(false)
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSubmit()
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
        'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-text',
        focused
          ? 'bg-[rgba(124,111,247,0.06)] border-[rgba(124,111,247,0.3)] shadow-[0_0_0_3px_rgba(124,111,247,0.08)]'
          : 'bg-[rgba(255,255,255,0.02)] border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(124,111,247,0.2)] hover:bg-[rgba(255,255,255,0.03)]'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border',
        focused
          ? 'border-[rgba(124,111,247,0.5)] bg-[rgba(124,111,247,0.12)]'
          : 'border-dashed border-[rgba(255,255,255,0.12)]'
      )}>
        <Plus className={cn('w-2.5 h-2.5 transition-colors', focused ? 'text-[#7C6FF7]' : 'text-[#454a5c]')} />
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
        className="flex-1 bg-transparent text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none"
      />
      {focused && value && (
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={handleSubmit}
          disabled={loading}
          aria-label="Add task"
          className="flex items-center justify-center w-6 h-6 rounded-lg bg-[rgba(124,111,247,0.2)] text-[#7C6FF7] flex-shrink-0 transition-all hover:bg-[rgba(124,111,247,0.35)] disabled:opacity-40"
        >
          <CornerDownLeft className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
