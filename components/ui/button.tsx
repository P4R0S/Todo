import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[13px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B5C] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:     'bg-gradient-to-br from-[#FF3B5C] to-[#FF0F3D] text-white shadow-[0_0_20px_rgba(255,59,92,0.3)] hover:shadow-[0_0_28px_rgba(255,59,92,0.45)] hover:opacity-95',
        outline:     'border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.18)]',
        ghost:       'text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f0f0f5]',
        destructive: 'bg-[#DC2626] text-white hover:opacity-90 shadow-[0_0_16px_rgba(220,38,38,0.25)]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 px-3 text-[12px]',
        lg:      'h-10 px-6',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
