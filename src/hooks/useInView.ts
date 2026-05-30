import { useEffect, useMemo, useRef, useState } from 'react'

type InViewOptions = IntersectionObserverInit & {
  once?: boolean
}

export function useInView<T extends Element>(options?: InViewOptions) {
  const { once = true, ...observerOptions } = options ?? {}
  const [inView, setInView] = useState(false)
  const elementRef = useRef<T | null>(null)

  const stableOptions = useMemo(
    () => ({
      root: observerOptions.root ?? null,
      rootMargin: observerOptions.rootMargin ?? '0px 0px -12% 0px',
      threshold: observerOptions.threshold ?? 0.12,
    }),
    [observerOptions.root, observerOptions.rootMargin, observerOptions.threshold],
  )

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (once) observer.disconnect()
      } else if (!once) {
        setInView(false)
      }
    }, stableOptions)

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, stableOptions])

  return { ref: elementRef, inView }
}

