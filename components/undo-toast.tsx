'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 min-w-[300px] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-2xl"
      style={{ background: 'rgba(16,16,28,0.96)', backdropFilter: 'blur(24px)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-[13px] font-medium text-[#f0f0f5] flex-1">{message}</span>
        <button
          onClick={onUndo}
          className="text-[13px] font-bold text-[#FF3B5C] hover:text-[#9d93f9] transition-colors"
        >
          Undo
        </button>
        <button
          onClick={onExpire}
          className="text-[#454a5c] hover:text-[#9099b0] transition-colors ml-1 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-[2px] bg-[rgba(255,255,255,0.05)]">
        <div
          className="h-full bg-gradient-to-r from-[#FF3B5C] to-[#FF0F3D]"
          style={{ width: `${progress}%`, transition: 'none' }}
        />
      </div>
    </motion.div>
  )
}
