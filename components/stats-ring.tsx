'use client'
import { useEffect, useState } from 'react'

interface StatsRingProps {
  pct: number
  total: number
  completed: number
  overdue: number
  dueToday: number
}

export function StatsRing({ pct, total, completed, overdue, dueToday }: StatsRingProps) {
  const [animPct, setAnimPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  const r = 52
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - animPct / 100)

  return (
    <div
      className="rounded-[20px] p-6 flex items-center gap-6 mb-3"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="relative flex-shrink-0">
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C6FF7" />
              <stop offset="100%" stopColor="#5E9EF7" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke="url(#ring-grad)" strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold text-[#f0f0f5] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {animPct}%
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#454a5c] mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
            done
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        <StatLine label="Total tasks" value={total} />
        <StatLine label="Completed" value={completed} color="#34d399" />
        <StatLine label="Overdue" value={overdue} color={overdue > 0 ? '#f87171' : '#454a5c'} />
        <StatLine label="Due today" value={dueToday} color="#fbbf24" />
      </div>
    </div>
  )
}

function StatLine({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[12px] text-[#454a5c]">{label}</span>
      <span className="text-[16px] font-extrabold" style={{ color: color ?? '#f0f0f5', fontFamily: 'var(--font-display)' }}>
        {value}
      </span>
    </div>
  )
}
