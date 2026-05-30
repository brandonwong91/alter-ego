import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../lib/cn'

export function SmartImage(props: {
  src?: string | null
  fallbackSrc?: string | null
  alt: string
  className?: string
  imgClassName?: string
  overlayClassName?: string
}) {
  const { src, fallbackSrc, alt, className, imgClassName, overlayClassName } = props
  const [activeSrc, setActiveSrc] = useState<string | null>(src ?? null)
  const [loaded, setLoaded] = useState(false)

  const resolved = useMemo(() => {
    if (activeSrc) return activeSrc
    if (fallbackSrc) return fallbackSrc
    return null
  }, [activeSrc, fallbackSrc])

  useEffect(() => {
    setActiveSrc(src ?? null)
    setLoaded(false)
  }, [src])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(215,200,241,0.22),rgba(215,200,241,0)_60%),radial-gradient(circle_at_75%_30%,rgba(255,214,191,0.18),rgba(255,214,191,0)_65%),linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(20,16,28,0.22))]',
          overlayClassName,
        )}
      />
      {resolved ? (
        <img
          src={resolved}
          alt={alt}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (activeSrc) {
              setActiveSrc(null)
              setLoaded(false)
            }
          }}
        />
      ) : null}
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-white/6" />
      ) : null}
    </div>
  )
}

