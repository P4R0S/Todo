'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, List, Monitor, BarChart2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateTaskModal } from './create-task-modal'
import type { Project } from '@/lib/types'

interface MobileNavProps {
  projects: Project[]
  userEmail: string
}

const NAV_ITEMS = [
  { href: '/today',    icon: Zap,      label: 'Today' },
  { href: '/all',      icon: List,     label: 'All' },
  { href: '/projects', icon: Monitor,  label: 'Projects' },
  { href: '/stats',    icon: BarChart2, label: 'Stats' },
]

export function MobileNav({ projects, userEmail: _ }: MobileNavProps) {
  const pathname = usePathname()

  const fab = (
    <button
      type="button"
      aria-label="Add task"
      className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform duration-150"
      style={{
        background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)',
        boxShadow: '0 0 24px rgba(124,111,247,0.5), 0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <Plus className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
    </button>
  )

  return (
    <>
      {/* Floating FAB — above the nav */}
      <div className="md:hidden fixed right-5 z-30" style={{ bottom: '80px' }}>
        <CreateTaskModal projects={projects} trigger={fab} />
      </div>

      {/* Bottom navigation bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,255,255,0.06)]"
        style={{ background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-around h-[72px]">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-[3px] py-2 transition-colors duration-200',
                  active ? 'text-[#7C6FF7]' : 'text-[#454a5c]'
                )}
              >
                <Icon
                  className={cn('w-5 h-5 transition-all duration-200', active ? 'opacity-100' : 'opacity-60')}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className="text-[10px] font-bold"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
                >
                  {label}
                </span>
                {active && (
                  <div className="w-1 h-1 rounded-full bg-[#7C6FF7]" style={{ boxShadow: '0 0 6px #7C6FF7' }} />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
