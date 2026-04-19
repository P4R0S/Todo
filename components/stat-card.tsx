interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  subColor?: string
  progress?: number
}

export function StatCard({ label, value, sub, subColor, progress }: StatCardProps) {
  return (
    <div className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-3.5">
      <p className="text-[11px] text-[#4a4f5a] uppercase tracking-[0.3px] mb-1.5">{label}</p>
      <p className="text-[22px] font-bold tracking-tight text-[#ededef]">{value}</p>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: subColor ?? '#5E6AD2' }}>{sub}</p>}
      {progress !== undefined && (
        <div className="mt-2.5 bg-[rgba(255,255,255,0.05)] rounded h-[3px] overflow-hidden">
          <div
            className="h-full rounded bg-gradient-to-r from-[#5E6AD2] to-[#7C85E8] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}
