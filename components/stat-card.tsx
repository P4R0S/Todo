interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  subColor?: string
  progress?: number
}

export function StatCard({ label, value, sub, subColor, progress }: StatCardProps) {
  return (
    <div className="flex-1 rounded-xl p-4 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.035)] transition-colors duration-200 relative overflow-hidden">
      {/* Subtle gradient accent in corner */}
      <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30"
           style={{ background: 'radial-gradient(circle, rgba(255,59,92,0.15) 0%, transparent 70%)' }} />

      <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2"
         style={{ fontFamily: 'var(--font-display)' }}>
        {label}
      </p>
      <p className="text-[28px] font-bold tracking-tight text-[#f0f0f5] leading-none mb-1"
         style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] font-semibold mt-1" style={{ color: subColor ?? '#FF3B5C' }}>
          {sub}
        </p>
      )}
      {progress !== undefined && (
        <div className="mt-3 bg-[rgba(255,255,255,0.05)] rounded-full h-[3px] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: 'linear-gradient(90deg, #FF3B5C, #FF0F3D)',
              boxShadow: '0 0 6px rgba(255,59,92,0.5)',
            }}
          />
        </div>
      )}
    </div>
  )
}
