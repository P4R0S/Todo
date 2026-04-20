'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, List, FolderOpen, SlidersHorizontal, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateTaskModal } from './create-task-modal'
import type { Project } from '@/lib/types'

interface MobileNavProps {
  projects: Project[]
  userEmail: string
}

const NAV_ITEMS = [
  { href: '/today',    icon: Zap,               label: 'Today' },
  { href: '/all',      icon: List,              label: 'All' },
  { href: '/projects', icon: FolderOpen,        label: 'Projects' },
  { href: '/settings', icon: SlidersHorizontal, label: 'Settings' },
]

export function MobileNav({ projects, userEmail: _ }: MobileNavProps) {
  const pathname = usePathname()

  const fab = (
    <button
      type="button"
      aria-label="Add task"
      className="w-[46px] h-[46px] rounded-full flex items-center justify-center mb-3 flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)',
        boxShadow: '0 0 22px rgba(124,111,247,0.55), 0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
    </button>
  )

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,255,255,0.05)]"
      style={{ background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(24px) saturate(180%)' }}
    >
      <div className="flex items-end h-[60px]">
        {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 pb-3 pt-2 text-[10px] font-semibold tracking-wide transition-all duration-200',
                active ? 'text-[#7C6FF7]' : 'text-[#454a5c]'
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                {label}
              </span>
            </Link>
          )
        })}

        <div className="flex-1 flex justify-center items-end pb-0">
          <CreateTaskModal projects={projects} trigger={fab} />
        </div>

        {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 pb-3 pt-2 text-[10px] font-semibold tracking-wide transition-all duration-200',
                active ? 'text-[#7C6FF7]' : 'text-[#454a5c]'
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}