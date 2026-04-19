'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, FolderOpen, List, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  const items = [
    { href: '/today',    icon: Zap,        label: 'Today' },
    { href: '/all',      icon: List,       label: 'All' },
    { href: '/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/login',    icon: User,       label: 'Account' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,255,255,0.05)]"
         style={{ background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(24px) saturate(180%)' }}>
      <div className="flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href) && href !== '/login'
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-wide transition-all duration-200',
                active ? 'text-[#7C6FF7]' : 'text-[#454a5c] hover:text-[#9099b0]'
              )}
            >
              <div className={cn(
                'w-8 h-5 flex items-center justify-center rounded-md transition-all duration-200',
                active ? 'bg-[rgba(124,111,247,0.15)]' : ''
              )}>
                <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn('tracking-[0.5px]', active ? 'text-[#7C6FF7]' : '')}
                    style={{ fontFamily: 'var(--font-display)' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
