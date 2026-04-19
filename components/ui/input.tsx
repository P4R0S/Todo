import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1 text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] transition-all focus-visible:outline-none focus-visible:border-[rgba(124,111,247,0.5)] focus-visible:bg-[rgba(124,111,247,0.05)] focus-visible:shadow-[0_0_0_3px_rgba(124,111,247,0.08)] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
