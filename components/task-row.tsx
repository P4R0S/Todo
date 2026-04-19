'use client'
import { useTransition } from 'react'
import { Check } from 'lucide-react'
import { cn, PRIORITY_LABEL, PRIORITY_COLOR, getTodayString } from '@/lib/utils'
import { ProjectDot } from './project-dot'
import { completeTask } from '@/lib/actions/tasks'
import type { Task } from '@/lib/types'

interface TaskRowProps {
  task: Task & { project?: { name: string; color: string } }
  showProject?: boolean
  onClick: () => void
}

export function TaskRow({ task, showProject = false, onClick }: TaskRowProps) {
  const [pending, startTransition] = useTransition()

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => completeTask(task.id, !task.completed))
  }

  const today = getTodayString()
  const isOverdue = !task.completed && task.due_date != null && task.due_date < today

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] border transition-all duration-150 cursor-pointer',
        'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)]',
        'hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.09)]',
        task.completed && 'opacity-50'
      )}
    >
      <button
        onClick={handleCheck}
        disabled={pending}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={cn(
          'w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-150',
          task.completed
            ? 'bg-[#5E6AD2] border-[#5E6AD2]'
            : 'border-[rgba(255,255,255,0.15)] hover:border-[#5E6AD2]'
        )}
      >
        {task.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />}
      </button>

      {showProject && task.project && <ProjectDot color={task.project.color} />}

      <span className={cn(
        'flex-1 text-[13px] truncate',
        task.completed ? 'line-through text-[#4a4f5a]' : 'text-[#d4d8e2]'
      )}>
        {task.title}
      </span>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {task.priority !== 'none' && (
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md font-medium', PRIORITY_COLOR[task.priority])}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        )}
        {task.due_date && !task.completed && (
          <span className={cn('text-[11px]', isOverdue ? 'text-red-400' : 'text-[#4a4f5a]')}>
            {isOverdue ? 'Overdue' : task.due_date}
          </span>
        )}
      </div>
    </div>
  )
}
