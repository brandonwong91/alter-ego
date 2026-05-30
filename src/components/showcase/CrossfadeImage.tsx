import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../lib/cn'

export function CrossfadeImage(props: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  durationMs?: number
}) {
  const { src, alt, className, imgClassName, durationMs = 650 } = props
  const [frontSrc, setFrontSrc] = useState(src)
  const [backSrc, setBackSrc] = useState<string | null>(null)
  const [frontLoaded, setFrontLoaded] = useState(true)

  const transitionMs = useMemo(() => Math.max(220, durationMs), [durationMs])

  useEffect(() => {
    if (src === frontSrc) return
    const raf = window.requestAnimationFrame(() => {
      setBackSrc(frontSrc)
      setFrontSrc(src)
      setFrontLoaded(false)
    })
    return () => window.cancelAnimationFrame(raf)
  }, [frontSrc, src])

  useEffect(() => {
    if (!backSrc) return
    if (!frontLoaded) return
    const t = window.setTimeout(() => setBackSrc(null), transitionMs + 40)
    return () => window.clearTimeout(t)
  }, [backSrc, frontLoaded, transitionMs])

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden pointer-events-none select-none',
        className,
      )}
    >
      {backSrc ? (
        <img
          src={backSrc}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity',
            frontLoaded ? 'opacity-0' : 'opacity-100',
            imgClassName,
          )}
          style={{ transitionDuration: `${transitionMs}ms` }}
        />
      ) : null}
      <img
        src={frontSrc}
        alt={alt}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity',
          backSrc && !frontLoaded ? 'opacity-0' : 'opacity-100',
          imgClassName,
        )}
        style={{ transitionDuration: `${transitionMs}ms` }}
        onLoad={() => setFrontLoaded(true)}
      />
    </div>
  )
}
