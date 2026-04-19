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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative"
           style={{ background: 'rgba(124,111,247,0.08)', border: '1px solid rgba(124,111,247,0.15)' }}>
        <div className="absolute inset-0 rounded-2xl"
             style={{ background: 'radial-gradient(circle at center, rgba(124,111,247,0.2) 0%, transparent 70%)' }} />
        <CheckCircle2 className="w-6 h-6 text-[#7C6FF7] relative z-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-bold text-[#f0f0f5] mb-1.5"
          style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-[#9099b0] mb-5 max-w-[240px] leading-relaxed font-medium">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm"
          className="shadow-[0_0_20px_rgba(124,111,247,0.3)]">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
