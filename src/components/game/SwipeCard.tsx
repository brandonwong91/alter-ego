import { useMemo, useRef, useState } from 'react'

import { cn } from '../../lib/cn'

export function SwipeCard(props: {
  title: string
  text: string
  leftLabel: string
  rightLabel: string
  onSwipeLeft: () => void
  onSwipeRight: () => void
  disabled?: boolean
}) {
  const { title, text, leftLabel, rightLabel, onSwipeLeft, onSwipeRight, disabled } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const start = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const threshold = useMemo(() => {
    const w = ref.current?.getBoundingClientRect().width ?? 420
    return Math.max(110, Math.min(160, w * 0.22))
  }, [ref.current])

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    const el = ref.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY, tx: delta.x, ty: delta.y }
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !start.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    setDelta({ x: start.current.tx + dx, y: start.current.ty + dy })
  }

  const settle = (direction: 'left' | 'right' | 'none') => {
    if (direction === 'left') {
      setDelta({ x: -threshold * 1.6, y: delta.y * 0.2 })
      window.setTimeout(() => onSwipeLeft(), 120)
      return
    }
    if (direction === 'right') {
      setDelta({ x: threshold * 1.6, y: delta.y * 0.2 })
      window.setTimeout(() => onSwipeRight(), 120)
      return
    }
    setDelta({ x: 0, y: 0 })
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (delta.x <= -threshold) {
      settle('left')
      return
    }
    if (delta.x >= threshold) {
      settle('right')
      return
    }
    settle('none')
  }

  const rotate = Math.max(-10, Math.min(10, delta.x * 0.02))
  const leftActive = delta.x < -threshold * 0.55
  const rightActive = delta.x > threshold * 0.55

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-6 flex justify-between text-[12px] uppercase tracking-[0.22em]">
        <div
          className={cn(
            'rounded-full border border-white/14 bg-white/10 px-4 py-2 text-ink-2 backdrop-blur-xl transition',
            leftActive ? 'text-ink-1 border-white/22 bg-white/16' : null,
          )}
        >
          ← {leftLabel}
        </div>
        <div
          className={cn(
            'rounded-full border border-white/14 bg-white/10 px-4 py-2 text-ink-2 backdrop-blur-xl transition',
            rightActive ? 'text-ink-1 border-white/22 bg-white/16' : null,
          )}
        >
          {rightLabel} →
        </div>
      </div>

      <div
        ref={ref}
        className={cn(
          'select-none rounded-[30px] border border-white/16 bg-white/10 p-6 shadow-bloom backdrop-blur-2xl sm:p-8',
          disabled ? 'opacity-70' : null,
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        style={{
          transform: `translate3d(${delta.x}px, ${delta.y}px, 0) rotate(${rotate}deg)`,
          transition: dragging ? 'none' : 'transform 180ms cubic-bezier(.16,1,.3,1)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="text-[12px] uppercase tracking-[0.22em] text-ink-3">Decision</div>
        <div className="mt-3 font-display text-[34px] leading-[1.05] tracking-[-0.03em] text-ink-1 sm:text-[40px]">
          {title}
        </div>
        <div className="mt-4 whitespace-pre-line text-[16px] leading-[1.95] text-ink-2">
          {text}
        </div>
      </div>
    </div>
  )
}

