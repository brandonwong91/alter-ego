import type { CSSProperties, HTMLAttributes } from 'react'

import { useRef } from 'react'

import { cn } from '../../lib/cn'

export function PointerField(props: HTMLAttributes<HTMLDivElement>) {
  const { className, onPointerMove, onPointerLeave, ...rest } = props
  const rootRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onPointerMove={(e) => {
        const el = rootRef.current
        if (el) {
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width
          const y = (e.clientY - r.top) / r.height
          el.style.setProperty('--mx', `${Math.max(0, Math.min(1, x))}`)
          el.style.setProperty('--my', `${Math.max(0, Math.min(1, y))}`)
        }
        onPointerMove?.(e)
      }}
      onPointerLeave={(e) => {
        const el = rootRef.current
        if (el) {
          el.style.setProperty('--mx', '0.55')
          el.style.setProperty('--my', '0.35')
        }
        onPointerLeave?.(e)
      }}
      style={
        {
          '--mx': '0.55',
          '--my': '0.35',
        } as CSSProperties
      }
      {...rest}
    />
  )
}
