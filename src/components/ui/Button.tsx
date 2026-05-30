import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    'text-ink-1 bg-fog-1/55 border-white/30 shadow-glass hover:bg-fog-1/70 hover:border-white/40 active:bg-fog-1/80',
  secondary:
    'text-ink-1 bg-white/10 border-white/20 hover:bg-white/14 hover:border-white/30 active:bg-white/18',
  ghost:
    'text-ink-1 bg-transparent border-white/0 hover:bg-white/8 hover:border-white/20 active:bg-white/12',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
}

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
  },
) {
  const { className, variant = 'primary', size = 'md', type, ...rest } = props

  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur-xl transition',
        'outline-none focus-visible:ring-2 focus-visible:ring-lilac-2/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fog-1',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:translate-y-[0.5px]',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  )
}

