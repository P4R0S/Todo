import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Task, Priority } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns today as YYYY-MM-DD in the browser's local timezone */
export function getTodayString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0, high: 1, medium: 2, low: 3, none: 4,
}

export function priorityOrder(p: Priority): number {
  return PRIORITY_ORDER[p]
}

/** Sort incomplete tasks: priority → due_date ASC (nulls last) → created_at ASC */
export function sortTasks<T extends Pick<Task, 'priority' | 'due_date' | 'created_at'>>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const pd = priorityOrder(a.priority) - priorityOrder(b.priority)
    if (pd !== 0) return pd

    if (a.due_date && b.due_date) {
      const dc = a.due_date.localeCompare(b.due_date)
      if (dc !== 0) return dc
    } else if (a.due_date) return -1
    else if (b.due_date) return 1

    return a.created_at.localeCompare(b.created_at)
  })
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  none: 'None', low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent',
}

export const PRIORITY_COLOR: Record<Priority, string> = {
  none:   'bg-subtle/20 text-subtle',
  low:    'bg-subtle/20 text-muted',
  medium: 'bg-yellow-500/10 text-yellow-400',
  high:   'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
}
