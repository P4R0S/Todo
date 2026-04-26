'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Focus } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await (mode === 'signin'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password }))
    if (error) { setError(error.message); setLoading(false) }
    else { window.location.href = '/today' }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden">

      {/* Floating orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(124,111,247,0.4) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(124,111,247,0.5)]"
               style={{ background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)' }}>
            <Focus className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#f0f0f5]"
              style={{ fontFamily: 'var(--font-display)' }}>
            Tudu
          </h1>
          <p className="text-[13px] text-[#9099b0] mt-1 font-medium">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card with gradient border */}
        <div className="rounded-2xl p-[1px]"
             style={{ background: 'linear-gradient(135deg, rgba(124,111,247,0.25), rgba(255,255,255,0.04), rgba(94,158,247,0.15))' }}>
          <div className="rounded-[15px] p-6 space-y-4"
               style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(40px)' }}>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[13px] font-semibold text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)] transition-all duration-150 disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
              <span className="text-[11px] font-semibold text-[#454a5c] tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}>OR</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#454a5c] mb-1.5 tracking-wide uppercase"
                       style={{ fontFamily: 'var(--font-display)' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.05)] transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#454a5c] mb-1.5 tracking-wide uppercase"
                       style={{ fontFamily: 'var(--font-display)' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.05)] transition-all"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] text-[#f87171] font-medium"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-150 disabled:opacity-50 mt-1"
                style={{
                  background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)',
                  boxShadow: '0 0 24px rgba(124,111,247,0.35)',
                }}
              >
                {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="text-[12px] text-center text-[#454a5c] font-medium">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-[#7C6FF7] hover:text-[#9d93f9] font-semibold transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
