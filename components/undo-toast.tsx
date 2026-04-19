'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface UndoToastProps {
  message: string
  onUndo: () => void
  onExpire: () => void
  duration?: number
}

export function UndoToast({ message, onUndo, onExpire, duration = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining === 0) { clearInterval(interval); onExpire() }
    }, 50)
    return () => clearInterval(interval)
  }, [duration, onExpire])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 min-w-[280px] bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-[13px] text-[#ededef] flex-1">{message}</span>
        <button
          onClick={onUndo}
          className="text-[13px] font-semibold text-[#a5aaee] hover:text-[#5E6AD2] transition-colors"
        >
          Undo
        </button>
        <button onClick={onExpire} className="text-[#4a4f5a] hover:text-[#8a8f98] transition-colors ml-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-[2px] bg-[rgba(255,255,255,0.05)]">
        <div className="h-full bg-[#5E6AD2]" style={{ width: `${progress}%`, transition: 'none' }} />
      </div>
    </div>
  )
}
