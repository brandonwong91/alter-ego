import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-white/18 bg-white/10 px-4 text-[14px] text-ink-1 placeholder:text-ink-3',
        'outline-none backdrop-blur-xl transition',
        'focus-visible:border-lilac-2/60 focus-visible:ring-2 focus-visible:ring-lilac-2/30',
        className,
      )}
      {...rest}
    />
  )
}

