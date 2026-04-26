import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProjects } from '@/lib/actions/projects'
import { getAllTasks } from '@/lib/actions/tasks'
import { Sidebar } from '@/components/sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { SearchModal } from '@/components/search-modal'
import { SearchProvider } from '@/lib/contexts/search-context'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [projects, tasks] = await Promise.all([getProjects(), getAllTasks()])

  return (
    <SearchProvider>
      <div className="flex h-dvh overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar projects={projects} userEmail={user.email ?? ''} />
        </div>
        <main className="flex-1 overflow-hidden flex flex-col pb-[72px] md:pb-0">
          {children}
        </main>
        <MobileNav projects={projects} userEmail={user.email ?? ''} />
      </div>
      <SearchModal tasks={tasks as any} />
    </SearchProvider>
  )
}
