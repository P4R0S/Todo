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
    { href: '/projects',     icon: FolderOpen, label: 'Projects' },
    { href: '/login',    icon: User,       label: 'Account' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0a0a0f]/95 backdrop-blur border-t border-[rgba(255,255,255,0.06)]">
      <div className="flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href) && href !== '/login'
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors duration-150',
                active ? 'text-[#a5aaee]' : 'text-[#4a4f5a] hover:text-[#8a8f98]'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
