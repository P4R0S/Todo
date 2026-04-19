'use client'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AddTaskButton() {
  return (
    <Button
      type="button"
      size="sm"
      className="shadow-[0_0_16px_rgba(94,106,210,0.3)]"
      onClick={() => {
        const input = document.getElementById('quick-add-input') as HTMLInputElement | null
        input?.focus()
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }}
    >
      <Plus className="w-3 h-3 mr-1" /> Add Task
    </Button>
  )
}
