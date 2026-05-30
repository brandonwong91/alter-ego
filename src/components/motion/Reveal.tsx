import type { ReactNode } from 'react'

import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'

export function Reveal(props: {
  children: ReactNode
  className?: string
  delayMs?: number
  once?: boolean
}) {
  const { children, className, delayMs = 0, once = true } = props
  const { ref, inView } = useInView<HTMLDivElement>({ once })

  return (
    <div
      ref={ref}
      className={cn(
        'will-change-transform',
        inView ? 'animate-reveal-up' : 'opacity-0 translate-y-4',
        className,
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

