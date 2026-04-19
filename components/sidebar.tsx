'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, List, Plus, LogOut, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/types'

interface SidebarProps {
  projects: Project[]
  userEmail: string
}

export function Sidebar({ projects, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-[220px] min-w-[220px] h-full bg-[rgba(255,255,255,0.02)] border-r border-[rgba(255,255,255,0.06)] flex flex-col py-4 px-3">
      <div className="flex items-center gap-2.5 px-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5E6AD2] to-[#7C85E8] flex items-center justify-center flex-shrink-0">
          <CheckSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight">Focus</span>
      </div>

      <NavItem href="/today" icon={<Zap className="w-3.5 h-3.5" />} label="Today" active={pathname === '/today'} />
      <NavItem href="/all"   icon={<List className="w-3.5 h-3.5" />} label="All Tasks" active={pathname === '/all'} />

      <p className="text-[10px] font-semibold text-[#4a4f5a] uppercase tracking-[0.8px] px-2.5 mt-4 mb-1">Projects</p>

      {projects.map(p => (
        <NavItem
          key={p.id}
          href={`/projects/${p.id}`}
          icon={<span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />}
          label={p.name}
          active={pathname === `/projects/${p.id}`}
        />
      ))}

      <Link
        href="/projects/new"
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#4a4f5a] hover:text-[#8a8f98] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="text-[12px]">Add project</span>
      </Link>

      <div className="mt-auto flex items-center gap-2 px-2.5 py-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5E6AD2] to-[#34d399] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
          {userEmail[0]?.toUpperCase() ?? '?'}
        </div>
        <span className="text-[11px] text-[#8a8f98] truncate flex-1">{userEmail}</span>
        <button
          onClick={handleSignOut}
          className="text-[#4a4f5a] hover:text-[#8a8f98] transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active }: {
  href: string; icon: React.ReactNode; label: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150',
        active
          ? 'bg-[rgba(94,106,210,0.15)] text-[#a5aaee]'
          : 'text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#c4c8d4]'
      )}
    >
      {icon}
      <span className="flex-1">{label}</span>
    </Link>
  )
}
