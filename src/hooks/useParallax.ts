import { useEffect, useState } from 'react'

export function useParallax(strength: number) {
  const [y, setY] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setY(window.scrollY * strength)
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [strength])

  return y
}

