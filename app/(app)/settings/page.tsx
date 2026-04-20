import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-5 pb-0 flex-shrink-0">
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <div>
          <p
            className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Account
          </p>
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
            <div className="px-4 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
              <p className="text-[11px] text-[#454a5c] font-medium">Signed in as</p>
              <p className="text-[13px] font-semibold text-[#d8dce8] mt-0.5">{user.email}</p>
            </div>
            <div className="px-4 py-3 bg-[rgba(255,255,255,0.02)]">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
