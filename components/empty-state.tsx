import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[rgba(94,106,210,0.1)] flex items-center justify-center mb-4">
        <CheckCircle2 className="w-6 h-6 text-[#5E6AD2]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#ededef] mb-1">{title}</h3>
      {description && <p className="text-[13px] text-[#8a8f98] mb-5 max-w-[260px]">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="shadow-[0_0_16px_rgba(94,106,210,0.3)]">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
