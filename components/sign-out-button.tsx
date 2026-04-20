'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-[13px] font-semibold text-[#f87171] hover:text-red-300 transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  )
}
