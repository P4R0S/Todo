'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, List, Plus, LogOut, Focus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useSearch } from '@/lib/contexts/search-context'
import type { Project } from '@/lib/types'

interface SidebarProps {
  projects: Project[]
  userEmail: string
}

export function Sidebar({ projects, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { openSearch } = useSearch()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] min-w-[220px] h-full flex flex-col py-4 px-3 border-r border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.25)] backdrop-blur-xl">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2.5 mb-6">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C6FF7] to-[#5E9EF7] flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(124,111,247,0.4)]">
          <Focus className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </div>
        <span className="text-[15px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Tudu</span>
      </div>

      {/* Search button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg w-full text-[13px] font-medium text-[#9099b0] hover:text-[#c8cce0] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-150 mb-1 group"
      >
        <Search className="w-3.5 h-3.5 text-[#454a5c] group-hover:text-[#9099b0] transition-colors" />
        <span className="flex-1 text-left">Search</span>
        <span
          className="text-[9px] font-bold text-[#454a5c] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ⌘K
        </span>
      </button>

      {/* Main nav */}
      <div className="space-y-0.5">
        <SidebarItem href="/today"  icon={<Zap className="w-3.5 h-3.5" />}  label="Today"     active={pathname === '/today'} />
        <SidebarItem href="/all"    icon={<List className="w-3.5 h-3.5" />} label="All Tasks" active={pathname === '/all'} />
      </div>

      {/* Projects */}
      <div className="mt-5">
        <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] px-2.5 mb-1.5"
           style={{ fontFamily: 'var(--font-display)' }}>
          Projects
        </p>
        <div className="space-y-0.5">
          {projects.map(p => (
            <ProjectItem
              key={p.id}
              href={`/projects/${p.id}`}
              label={p.name}
              color={p.color}
              active={pathname === `/projects/${p.id}`}
            />
          ))}
          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 mt-0.5"
          >
            <Plus className="w-3 h-3" />
            <span className="text-[12px] font-medium">New project</span>
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C6FF7] to-[#34d399] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            {userEmail[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-[11px] text-[#9099b0] truncate flex-1 font-medium">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="text-[#454a5c] hover:text-[#9099b0] transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ href, icon, label, active }: {
  href: string; icon: React.ReactNode; label: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative',
        active
          ? 'text-[#f0f0f5] bg-[rgba(124,111,247,0.1)]'
          : 'text-[#9099b0] hover:text-[#c8cce0] hover:bg-[rgba(255,255,255,0.04)]'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#7C6FF7] rounded-r-full shadow-[0_0_8px_rgba(124,111,247,0.6)]" />
      )}
      <span className={cn(active ? 'text-[#7C6FF7]' : '')}>{icon}</span>
      {label}
    </Link>
  )
}

function ProjectItem({ href, label, color, active }: {
  href: string; label: string; color: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 relative',
        active
          ? 'text-[#f0f0f5]'
          : 'text-[#9099b0] hover:text-[#c8cce0] hover:bg-[rgba(255,255,255,0.04)]'
      )}
      style={active ? { background: `${color}12` } : undefined}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      )}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-150"
        style={{ background: color, boxShadow: active ? `0 0 6px ${color}80` : 'none' }}
      />
      <span className="flex-1 truncate">{label}</span>
    </Link>
  )
}
